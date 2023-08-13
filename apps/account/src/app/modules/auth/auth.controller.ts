import { Body, Controller } from '@nestjs/common';

import { AccountLogin, AccountRegister } from '@microservices/contracts';

import { AuthService } from './auth.service';
import { RMQRoute } from 'nestjs-rmq';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQRoute(AccountRegister.topic)
  public async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return this.authService.registration(dto);
  }

  @RMQRoute(AccountLogin.topic)
  public async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);

    return this.authService.login(id);
  }
}
