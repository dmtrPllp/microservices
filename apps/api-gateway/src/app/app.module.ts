import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RMQModule } from 'nestjs-rmq';

import { AuthController } from './controllers/auth.controller';
import { getRMQConfig } from './configs/rmq.config';
import { getJWTConfig } from './configs/jwt.config';
import { UsersController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'env/.api.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
  ],
  controllers: [AuthController, UsersController],
})
export class AppModule {}
