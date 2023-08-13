import { Body, Controller, Post } from '@nestjs/common';

import { AccountLogin, AccountRegister } from '@microservices/contracts';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  public async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return this.authService.registration(dto);
  }

  @Post('login')
  public async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);

    return this.authService.login(id);
  }
}
