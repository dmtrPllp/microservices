import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { getJWTConfig } from '../../configs/jwt.config';

@Module({
  imports: [JwtModule.registerAsync(getJWTConfig()), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
