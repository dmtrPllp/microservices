import { IsString } from 'class-validator';

import { IUser } from '@microservices/interfaces';

export namespace AccountGetUserInfo {
  export const topic = 'account.get_user_info.query';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
    user: Omit<IUser, 'password'>;
  }
}
