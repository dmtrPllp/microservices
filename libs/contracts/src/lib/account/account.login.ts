export namespace AccountLogin {
  export const topic = 'account.login.command';

  export class Request {
    email: string;
    password: string;
    // @IsEmail()

    // @IsStrongPassword({
    //   minLength: 6,
    //   minLowercase: 2,Z
    //   minNumbers: 2,
    //   minUppercase: 1,
    //   minSymbols: 1,
    // })
  }

  export class Response {
    access_token: string;
  }
}
