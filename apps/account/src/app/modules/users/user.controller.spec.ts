import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';

import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';

import {
  AccountBuyCourse,
  AccountCheckPayment,
  AccountGetUserInfo,
  AccountLogin,
  AccountRegister,
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
} from '@microservices/contracts';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { getMongoConfig } from '../../configs/mongo.config';
import { UserRepository } from '../users/repositories/users.repository';
import { verify } from 'jsonwebtoken';

const authRegister: AccountRegister.Request = {
  email: 'test2@mail.ru',
  password: '11qqQ*',
  displayName: 'Dima',
};

const authLogin: AccountLogin.Request = {
  email: 'test2@mail.ru',
  password: '11qqQ*',
};

const courseId = 'courseId';

describe('UserController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let configService: ConfigService;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'envs/.account.env',
        }),
        RMQModule.forTest({}),
        MongooseModule.forRootAsync(getMongoConfig()),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    app = module.createNestApplication();

    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get<RMQTestService>(RMQService);
    configService = app.get<ConfigService>(ConfigService);

    await app.init();

    await rmqService.triggerRoute<
      AccountRegister.Request,
      AccountRegister.Response
    >(AccountRegister.topic, authRegister);

    const { access_token } = await rmqService.triggerRoute<
      AccountLogin.Request,
      AccountLogin.Response
    >(AccountLogin.topic, authLogin);

    token = access_token;

    const data = verify(token, configService.get('JWT_SECRET'));

    userId = data['id'];
  });

  it('AccountGetUserInfo', async () => {
    const res = await rmqService.triggerRoute<
      AccountGetUserInfo.Request,
      AccountGetUserInfo.Response
    >(AccountGetUserInfo.topic, { id: userId });

    expect(res.profile.displayName).toEqual(authRegister.displayName);
  });

  it('BuyCourse', async () => {
    const paymentLink = '';

    rmqService.mockReply<CourseGetCourse.Response>(CourseGetCourse.topic, {
      course: { _id: courseId, price: 1000 },
    });

    rmqService.mockReply<PaymentGenerateLink.Response>(
      PaymentGenerateLink.topic,
      {
        paymentLink,
      }
    );

    const res = await rmqService.triggerRoute<
      AccountBuyCourse.Request,
      AccountBuyCourse.Response
    >(AccountBuyCourse.topic, { userId, courseId });

    expect(res.paymentLink).toEqual(paymentLink);

    await expect(
      rmqService.triggerRoute<
        AccountBuyCourse.Request,
        AccountBuyCourse.Response
      >(AccountBuyCourse.topic, { userId, courseId })
    ).rejects.toThrowError();
  });

  it('CheckPayment', async () => {
    const paymentStatus = 'success';

    rmqService.mockReply<PaymentCheck.Response>(PaymentCheck.topic, {
      status: 'success',
    });

    const res = await rmqService.triggerRoute<
      AccountCheckPayment.Request,
      AccountCheckPayment.Response
    >(AccountCheckPayment.topic, { userId, courseId });

    expect(res.status).toEqual(paymentStatus);
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    app.close();
  });
});
