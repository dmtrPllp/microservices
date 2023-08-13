import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQCOnfig } from './configs/rmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'envs/.account.env',
    }),
    RMQModule.forRootAsync(getRMQCOnfig()),
    MongooseModule.forRootAsync(getMongoConfig()),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
