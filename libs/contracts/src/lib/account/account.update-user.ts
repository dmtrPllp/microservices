import { IUser } from '@microservices/interfaces';
import { IsObject, IsString } from 'class-validator';

export namespace AccountUpdateUser {
  export const topic = 'account.update-user.command';

  export class Request {
    @IsString()
    id: string;

    @IsObject()
    user: Pick<IUser, 'displayName'>;
  }

  export class Response {}
}
