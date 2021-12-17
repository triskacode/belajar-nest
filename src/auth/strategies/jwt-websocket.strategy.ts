import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
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
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('access-token'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.id);

    return { id: user.id, email: user.email };
  }
}
