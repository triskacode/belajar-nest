import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { UserService } from 'src/user/user.service';
import { ConnectToServerDto } from './dto/connect-to-server.dto';
import { DisconnectFromServerDto } from './dto/disconnect-from-server.dto';
import { ChatRepository } from './repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository)
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
  ) {}

  async connectToServer(connectToServerDto: ConnectToServerDto) {
    const user = await this.userService.findOne(connectToServerDto.userId);

    user.chat.socketId = connectToServerDto.socketId;
    user.chat.lastSeen = null;

    await this.chatRepository.save(user.chat);
  }

  async disconnectFromServer(disconnectFromServerDto: DisconnectFromServerDto) {
    const user = await this.userService.findOne(disconnectFromServerDto.userId);

    user.chat.socketId = null;
    user.chat.lastSeen = moment().format();

    await this.chatRepository.save(user.chat);
  }
}
