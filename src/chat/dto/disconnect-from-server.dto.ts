import { Chat } from '../entities/chat.entity';

export class DisconnectFromServerDto {
  socketId: Chat['socketId'];
}
