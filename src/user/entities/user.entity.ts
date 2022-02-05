import { Chat } from 'src/chat/entities/chat.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { select: false })
  password: string;

  @OneToOne(() => Chat, (chat) => chat.user, { cascade: true, eager: true })
  chat: Chat;
}
