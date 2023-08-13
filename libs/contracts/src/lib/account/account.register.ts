import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
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

    @IsOptional()
    @IsString()
    displayName?: string;
  }

  export class Response {
    email: string;
  }
}
