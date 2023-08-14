import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/users.repository';
import { UserCommands } from './users.commands';
import { UserQueries } from './users.queries';
import { UserEventEmitter } from './users.event-emitter';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository, UserEventEmitter, UserService],
  exports: [UserRepository],
  controllers: [UserCommands, UserQueries],
})
export class UsersModule {}
