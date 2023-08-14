import { Body, Controller } from '@nestjs/common';

import { RMQValidate, RMQRoute, RMQService } from 'nestjs-rmq';

import {
  AccountBuyCourse,
  AccountCheckPayment,
  AccountUpdateUser,
} from '@microservices/contracts';

import { UserRepository } from './repositories/users.repository';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUpdateUser.topic)
  public async updateUser(
    @Body() { user, id }: AccountUpdateUser.Request
  ): Promise<AccountUpdateUser.Response> {
    const existedUser = await this.userRepository.findUserById(id);

    if (!existedUser) {
      throw new Error('User does not exist');
    }

    const userEntity = new UserEntity(existedUser).updateUser(user.displayName);
    await this.userRepository.updateUser(userEntity);

    return {};
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  public async buyCourse(
    @Body() { userId, courseId }: AccountBuyCourse.Request
  ): Promise<AccountBuyCourse.Response> {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error('User does not exist');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();

    await this.userRepository.updateUser(user);

    return { paymentLink };
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  public async checkPaymnet(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error('User does not exist');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();

    await this.userRepository.updateUser(user);

    return { status };
  }
}
