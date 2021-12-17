import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', { nullable: true, default: null })
  socketId?: string | null;

  @Column('datetime', {
    nullable: true,
    default: moment().format(),
  })
  lastSeen?: string | null;

  @OneToOne(() => User, (user) => user.chat, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
