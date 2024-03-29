import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { authConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      ignoreExpiration: false,
      secretOrKey: authConstants.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findOneById(payload.id);

      return { id: user.id, email: user.email };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new UnauthorizedException();

      throw error;
    }
  }
}
