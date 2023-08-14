import { AccountChangedCourse } from '@microservices/contracts';
import {
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
  IDomainEvent,
} from '@microservices/interfaces';

import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  password: string;
  role: UserRole;
  courses: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exist = this.courses.find((x) => x._id === courseId);

    if (!exist) {
      this.courses.push({ courseId, purchaseState: state });
      return this;
    }

    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter((x) => x._id !== courseId);
      return this;
    }

    this.courses = this.courses.map((x) => {
      if (x._id === courseId) {
        x.purchaseState = state;
        return x;
      }
      return x;
    });

    this.events.push({
      topic: AccountChangedCourse.topic,
      data: { courseId, userId: this._id, state },
    });

    return this;
  }

  public getPublicProfile() {
    return {
      displayName: this.displayName,
      email: this.email,
      role: this.role,
    };
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
    return this;
  }

  public async validatePassword(password: string) {
    return await compare(password, this.password);
  }

  public updateUser(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}
