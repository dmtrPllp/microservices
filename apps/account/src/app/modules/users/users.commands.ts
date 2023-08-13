import { Body, Controller } from '@nestjs/common';

import { RMQValidate, RMQRoute } from 'nestjs-rmq';

import { AccountUpdateUser } from '@microservices/contracts';

import { UserRepository } from './repositories/users.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountUpdateUser.topic)
  public async getCurrentUser(
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
}
