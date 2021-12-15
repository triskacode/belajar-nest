import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersMapper {
  mapUsersToDto(users: User[]): UserDto[] {
    return users.map((user) => {
      delete user.password;

      return user;
    });
  }

  mapUserToDto(user: User): UserDto {
    delete user.password;

    return user;
  }
}
