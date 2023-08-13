import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RMQService } from 'nestjs-rmq';

import { AccountLogin, AccountRegister } from '@microservices/contracts';

import { UserRegisterDto } from '../dtos/registration.dto';
import { UserLoginDto } from '../dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly rmqService: RMQService) {}

  @ApiCreatedResponse({ type: AccountRegister.Response })
  @Post('registration')
  public async register(@Body() dto: UserRegisterDto) {
    try {
      return await this.rmqService.send<
        AccountRegister.Request,
        AccountRegister.Response
      >(AccountRegister.topic, dto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @ApiOkResponse({ type: AccountLogin.Response })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() dto: UserLoginDto) {
    try {
      return await this.rmqService.send<
        AccountLogin.Request,
        AccountLogin.Response
      >(AccountLogin.topic, dto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
    }
  }
}
