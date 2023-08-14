import { Body, Controller } from '@nestjs/common';

import { RMQValidate, RMQRoute } from 'nestjs-rmq';

import {
  AccountBuyCourse,
  AccountCheckPayment,
  AccountUpdateUser,
} from '@microservices/contracts';

import { UserService } from './users.service';

@Controller()
export class UserCommands {
  constructor(private readonly userService: UserService) {}

  @RMQValidate()
  @RMQRoute(AccountUpdateUser.topic)
  public async updateUser(
    @Body() { user, id }: AccountUpdateUser.Request
  ): Promise<AccountUpdateUser.Response> {
    return this.userService.updateUser(user, id);
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  public async buyCourse(
    @Body() { userId, courseId }: AccountBuyCourse.Request
  ): Promise<AccountBuyCourse.Response> {
    return this.userService.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  public async checkPaymnet(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    return this.userService.checkPayment(userId, courseId);
  }
}
