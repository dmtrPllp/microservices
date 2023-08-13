import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountLogin, AccountRegister } from '@microservices/contracts';
import { UserRole } from '@microservices/interfaces';

import { UserRepository } from '../users/user.repository';
import { UserEntity } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async registration({
    email,
    password,
    displayName,
  }: AccountRegister.Request): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUser(email);

    if (oldUser) {
      throw new Error('User already exists');
    }

    const newUserEntity = await new UserEntity({
      email,
      displayName,
      password: '',
      role: UserRole.Student,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);

    if (!user) {
      throw new Error('Login or password is incorrect');
    }

    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new Error('Login or password is incorrect');
    }

    return { id: user._id };
  }

  public async login(id: string): Promise<AccountLogin.Response> {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}
