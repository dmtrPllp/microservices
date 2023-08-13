import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsStrongPassword } from "class-validator";

export class UserLoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsStrongPassword({
      minLength: 6,
      minLowercase: 2,
      minNumbers: 2,
      minUppercase: 1,
      minSymbols: 1,
    })
    password: string;
  }