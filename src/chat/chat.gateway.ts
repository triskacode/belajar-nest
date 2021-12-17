import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWebsocketAuthGuard } from 'src/auth/guards/jwt-websocket-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { ChatExceptionsFilter } from './chat-exceptions.filter';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({
  cors: true,
  namespace: 'chat',
})
@UseFilters(ChatExceptionsFilter)
@UseGuards(JwtWebsocketAuthGuard)
@UsePipes(new ValidationPipe())
export class ChatGateway {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('connect-to-server')
  async handleConnectToServer(@ConnectedSocket() client: Socket) {
    const request: typeof client.handshake & { user: User } =
      client.handshake as any;

    await this.chatService.connectToServer({
      socketId: client.id,
      userId: request.user.id,
    });

    this.logger.log(`Client connected: ${client.id}.`);
  }

  @SubscribeMessage('disconnect-from-server')
  async handleDisconnectFromServer(@ConnectedSocket() client: Socket) {
    const request: typeof client.handshake & { user: User } =
      client.handshake as any;

    await this.chatService.disconnectFromServer({ userId: request.user.id });

    this.logger.log(`Client disconnected: ${client.id}.`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() messageDto: MessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<{ message: string }>> {
    this.server.except(client.id).emit('message', messageDto);

    return { event: 'message', data: { message: messageDto.message } };
  }
}
