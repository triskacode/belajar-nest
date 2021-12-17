import { User } from 'src/user/entities/user.entity';

export class ConnectToServerDto {
  socketId: string;
  userId: User['id'];
}
