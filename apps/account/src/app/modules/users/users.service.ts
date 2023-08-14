import { Injectable } from '@nestjs/common';

import { RMQService } from 'nestjs-rmq';

import { UserRepository } from './repositories/users.repository';
import { IUser } from '@microservices/interfaces';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventEmitter } from './users.event-emitter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly eventEmitter: UserEventEmitter
  ) {}

  public async updateUser(user: Pick<IUser, 'displayName'>, id: string) {
    const existedUser = await this.userRepository.findUserById(id);

    if (!existedUser) {
      throw new Error('User does not exist');
    }

    const userEntity = new UserEntity(existedUser).updateUser(user.displayName);
    await this.updateUserEvent(userEntity);

    return {};
  }

  public async buyCourse(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error('User does not exist');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();

    await this.updateUserEvent(user);

    return { paymentLink };
  }

  public async checkPayment(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error('User does not exist');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();

    await this.updateUserEvent(user);

    return { status };
  }

  private updateUserEvent(user: UserEntity) {
    return Promise.all([
      this.eventEmitter.handle(user),
      this.userRepository.updateUser(user),
    ]);
  }
}
