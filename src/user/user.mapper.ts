import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserMapper {
  mapEntitiesToDto(users: User[]): UserDto[] {
    return users.map((user) => {
      delete user.password;

      return user;
    });
  }

  mapEntityToDto(user: User): UserDto {
    delete user.password;

    return user;
  }

  async mapCreateUserDto(createUser: CreateUserDto): Promise<CreateUserDto> {
    const createUserHashed: CreateUserDto = {
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
    };

    return createUserHashed;
  }
}
