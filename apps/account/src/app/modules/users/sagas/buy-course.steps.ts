import {
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
  PaymentStatus,
} from '@microservices/contracts';
import { PurchaseState } from '@microservices/interfaces';

import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, { id: this.saga.courseId });

    if (!course) {
      throw new Error('Course does not exist');
    }

    if (course.price === 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      price: course.price,
    });

    this.saga.setState(PurchaseState.WaitingForPayment, course._id);

    return { paymentLink, user: this.saga.user };
  }

  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    throw new Error('You can not check the payment that is not started.');
  }

  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);

    return { user: this.saga.user };
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error(
      'Payment already in processing. You can not create new link'
    );
  }

  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      courseId: this.saga.courseId,
      userId: this.saga.user._id,
    });

    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
      return { user: this.saga.user, status: 'canceled' };
    }

    if (status !== 'success') {
      return { user: this.saga.user, status: 'process' };
    }

    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user, status: 'success' };
  }

  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Wait a minute. Payment already in processing.');
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('The course has already been purchased.');
  }

  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    throw new Error('The course has already been purchased.');
  }

  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('The course has already been purchased.');
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }

  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    throw new Error(
      'The purchase of the course was canceled. You can not check it payment.'
    );
  }

  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error(
      'The purchase of the course was canceled. You can not cancel it again.'
    );
  }
}
