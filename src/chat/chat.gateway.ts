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
  OnGatewayDisconnect,
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

interface MessageEntity {
  content: string;
  isOwner: boolean;
}

@WebSocketGateway({
  cors: true,
  namespace: 'chat',
})
@UseFilters(ChatExceptionsFilter)
@UseGuards(JwtWebsocketAuthGuard)
@UsePipes(new ValidationPipe())
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  async handleDisconnect(client: Socket) {
    await this.chatService.disconnectFromServer({ socketId: client.id });
    const usersOnline = await this.chatService.findUserOnlineInChat();

    client.broadcast.emit('list-user', usersOnline);

    this.logger.log(`Client disconnected: ${client.id}.`);
  }

  @SubscribeMessage('connect-to-server')
  async handleConnectToServer(
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<User[]>> {
    const request: typeof client.handshake & { user: User } =
      client.handshake as any;

    await this.chatService.connectToServer({
      socketId: client.id,
      userId: request.user.id,
    });
    const usersOnline = await this.chatService.findUserOnlineInChat();

    client.broadcast.emit('list-user', usersOnline);

    this.logger.log(`Client connected: ${client.id}.`);

    return {
      event: 'list-user',
      data: usersOnline,
    };
  }

  @SubscribeMessage('message-to-server')
  async handleMessage(
    @MessageBody() messageDto: MessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<MessageEntity>> {
    client.broadcast.emit('message-to-client', {
      ...messageDto,
      isOwner: false,
    });

    return {
      event: 'message-to-client',
      data: { ...messageDto, isOwner: true },
    };
  }
}
