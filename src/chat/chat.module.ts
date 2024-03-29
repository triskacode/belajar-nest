import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRepository]), UserModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
