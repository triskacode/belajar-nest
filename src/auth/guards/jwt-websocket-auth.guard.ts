import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtWebsocketAuthGuard extends AuthGuard('jwt-websocket') {
  getRequest(context) {
    return context.switchToWs().getClient().handshake;
  }
}
