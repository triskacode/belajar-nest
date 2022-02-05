import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserOnlineInChat() {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.chat', 'chat')
      .where('chat.socketId is not null')
      .andWhere('chat.lastSeen is null')
      .getMany();
  }
}
