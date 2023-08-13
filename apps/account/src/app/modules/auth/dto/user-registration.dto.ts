import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegistrationDto {
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

  @IsString()
  displayName?: string;
}
