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

  public async updateUser({ _id, ...rest }: UserEntity) {
    return this.userModel.updateOne({ _id }, { $set: rest }).exec();
  }

  public async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  public async findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  public async deleteUser(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }
}
