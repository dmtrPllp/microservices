import { Injectable } from '@nestjs/common';

import { UserRole } from '@microservices/interfaces';

import { RegistrationDto } from './dto/user-registration.dto';
import { UserRepository } from '../users/user.repository';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  public async registration({ email, password, displayName }: RegistrationDto) {
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

  public async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}
