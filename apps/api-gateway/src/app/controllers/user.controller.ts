import { Get, Controller, UseGuards } from '@nestjs/common';

import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';

@Controller('users')
export class UsersController {
  @UseGuards(JWTAuthGuard)
  @Get('get-me')
  public async getCurrentUser(@UserId() userId: string) {}
}
