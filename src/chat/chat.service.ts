import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { UserService } from 'src/user/user.service';
import { ConnectToServerDto } from './dto/connect-to-server.dto';
import { DisconnectFromServerDto } from './dto/disconnect-from-server.dto';
import { ChatRepository } from './repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
  ) {}

  async connectToServer(connectToServerDto: ConnectToServerDto) {
    const user = await this.userService.findOneById(connectToServerDto.userId);

    user.chat.socketId = connectToServerDto.socketId;
    user.chat.lastSeen = null;

    await this.chatRepository.save(user.chat);
  }

  async disconnectFromServer(
    disconnectFromServerDto: DisconnectFromServerDto,
  ): Promise<void> {
    const chat = await this.chatRepository.findOneBySocketId(
      disconnectFromServerDto.socketId,
    );

    if (chat) {
      chat.socketId = null;
      chat.lastSeen = moment().format();

      await this.chatRepository.save(chat);
    }
  }

  async findUserOnlineInChat() {
    return await this.userService.findUserOnlineInChat();
  }
}
