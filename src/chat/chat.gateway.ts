import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import * as moment from 'moment';
import { Server, Socket } from 'socket.io';
import { JwtWebsocketAuthGuard } from 'src/auth/guards/jwt-websocket-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ChatExceptionsFilter } from './chat-exceptions.filter';
import { MessageDto } from './dto/message.dto';
import { ChatRepository } from './repositories/chat.repository';

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

  constructor(
    @InjectRepository(ChatRepository)
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('connect-to-server')
  async handleConnectToServer(@ConnectedSocket() client: Socket) {
    const request: typeof client.handshake & { user: User } =
      client.handshake as any;
    const user = await this.userService.findOne(request.user.id);

    user.chat.socketId = client.id;
    user.chat.lastSeen = null;

    await this.chatRepository.save(user.chat);

    this.logger.log(`Client connected: ${client.id}.`);
  }

  @SubscribeMessage('disconnect-to-server')
  async handleDisconnectToServer(@ConnectedSocket() client: Socket) {
    const request: typeof client.handshake & { user: User } =
      client.handshake as any;
    const user = await this.userService.findOne(request.user.id);

    user.chat.socketId = null;
    user.chat.lastSeen = moment().format();

    await this.chatRepository.save(user.chat);

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
