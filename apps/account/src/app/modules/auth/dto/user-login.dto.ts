import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 2,
    minNumbers: 2,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}
