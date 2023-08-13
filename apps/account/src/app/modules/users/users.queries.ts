import { Body, Controller } from '@nestjs/common';

import { RMQValidate, RMQRoute } from 'nestjs-rmq';

import {
  AccountGetUserInfo,
  AccountUserCourses,
} from '@microservices/contracts';
import { UserRepository } from './repositories/users.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountGetUserInfo.topic)
  public async getCurrentUser(
    @Body() { id }: AccountGetUserInfo.Request
  ): Promise<AccountGetUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);

    const profile = new UserEntity(user).getPublicProfile();

    return { profile };
  }

  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  public async getUserCourses(
    @Body() { id }: AccountUserCourses.Request
  ): Promise<AccountUserCourses.Response> {
    const { courses } = await this.userRepository.findUserById(id);

    return { courses };
  }
}
