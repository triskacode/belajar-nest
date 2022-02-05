import { EntityRepository, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  findOneBySocketId(socketId: Chat['socketId']) {
    return this.createQueryBuilder('chat')
      .where('chat.socketId = :socketId', {
        socketId,
      })
      .getOne();
  }
}
