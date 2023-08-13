import { Get, Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  // @UseGuards(JWTAuthGuard)
  // @Get('get-me')
  // public async getCurrentUser(@UserId() userId: string) {}
}
