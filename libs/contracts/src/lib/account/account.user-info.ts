import { IsString } from 'class-validator';

import { IUser } from '@microservices/interfaces';

export namespace AccountGetUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
    profile: Omit<IUser, 'password'>;
  }
}
