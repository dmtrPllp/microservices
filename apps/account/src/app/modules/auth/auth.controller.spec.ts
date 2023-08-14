import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';

import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';

import { AccountLogin, AccountRegister } from '@microservices/contracts';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { getMongoConfig } from '../../configs/mongo.config';
import { UserRepository } from '../users/repositories/users.repository';

const authRegister: AccountRegister.Request = {
  email: 'test@mail.ru',
  password: '11qqQ*',
  displayName: 'Dima',
};

const authLogin: AccountLogin.Request = {
  email: 'test@mail.ru',
  password: '11qqQ*',
};

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;

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

    await app.init();
  });

  it('Registration', async () => {
    const res = await rmqService.triggerRoute<
      AccountRegister.Request,
      AccountRegister.Response
    >(AccountRegister.topic, authRegister);

    expect(res.email).toEqual(authRegister.email);
  });

  it('Login', async () => {
    const res = await rmqService.triggerRoute<
      AccountLogin.Request,
      AccountLogin.Response
    >(AccountLogin.topic, authLogin);

    expect(res.access_token).toBeDefined();
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    app.close();
  });
});
