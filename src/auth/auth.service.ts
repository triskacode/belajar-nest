import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { AccessTokenDto } from './dto/access-token.dto';
import { UsersMapper } from 'src/users/users.mapper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private userMapper: UsersMapper,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (user) {
        const isMatchPassword = await this.userService.comparePassword(
          password,
          user.password,
        );

        if (isMatchPassword) {
          return this.userMapper.mapEntityToDto(user);
        }
      }

      return null;
    } catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException();

      throw error;
    }
  }

  async login(user: Omit<User, 'password'>): Promise<AccessTokenDto> {
    const payload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
