import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Handshake } from 'socket.io/dist/socket';
import { UserService } from 'src/user/user.service';
import { authConstants } from '../constants';

@Injectable()
export class JwtWebsocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-websocket',
) {
  constructor(private readonly userService: UserService) {
    super({
      ignoreExpiration: false,
      secretOrKey: authConstants.jwt.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: unknown) => {
          const handshake = request as Handshake;
          let token: string | null;

          if (handshake && handshake.auth)
            token = handshake.auth['access-token'];
          else token = null;

          return token;
        },
      ]),
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
