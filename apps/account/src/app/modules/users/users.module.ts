import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/users.repository';
import { UserCommands } from './users.commands';
import { UserQueries } from './users.queries';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [UserCommands, UserQueries],
})
export class UsersModule {}
