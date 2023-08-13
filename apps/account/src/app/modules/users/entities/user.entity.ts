import { IUser, IUserCourses, UserRole } from '@microservices/interfaces';

import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  password: string;
  role: UserRole;
  courses: IUserCourses[];

  constructor(user: IUser) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.courses = user.courses;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
    return this;
  }

  public async validatePassword(password: string) {
    return await compare(password, this.password);
  }
}
