import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';

import { User } from '../models/user.model';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  public async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  public async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  public async findUserById(id: string) {
    return this.userModel.findById(id).select(['_id', 'email', 'displayName', 'role', 'courses']).exec();
  }

  public async deleteUser(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }
}
