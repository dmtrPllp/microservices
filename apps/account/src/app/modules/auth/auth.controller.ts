import { Body, Controller, Post } from '@nestjs/common';

import { RegistrationDto } from './dto/user-registration.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  public async register(@Body() dto: RegistrationDto) {
    return this.authService.registration(dto);
  }

  @Post('login')
  public async login(@Body() { email, password }: LoginDto) {
    const { id } = await this.authService.validateUser(email, password);

    return this.authService.login(id);
  }
}
