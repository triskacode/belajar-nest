import { User } from 'src/user/entities/user.entity';

export class DisconnectFromServerDto {
  userId: User['id'];
}
