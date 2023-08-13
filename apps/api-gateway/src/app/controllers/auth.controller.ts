import { Body, Controller, Post } from '@nestjs/common';

import { AccountLogin, AccountRegister } from '@microservices/contracts';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('registration')
  public async register(@Body() dto: AccountRegister.Request) {}

  @Post('login')
  public async login(@Body() { email, password }: AccountLogin.Request) {}
}
