export namespace AccountRegister {
    export const topic = 'account.register.command';
  
    export class Request {
      email: string;
      password: string;
      displayName?: string;
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
      email: string;
    }
  }
  