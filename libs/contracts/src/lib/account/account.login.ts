import { IsEmail, IsStrongPassword } from 'class-validator';

export namespace AccountLogin {
  export const topic = 'account.login.command';

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
  }

  export class Response {
    access_token: string;
  }
}
