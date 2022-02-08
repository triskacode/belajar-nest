import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';
import { Post } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id?: number;

  @Column('varchar', { unique: true })
  @Field(() => String)
  email: string;

  @Column('varchar', { select: false })
  @Field(() => String)
  password: string;

  @OneToOne(() => Chat, (chat) => chat.user, { cascade: true })
  chat?: Chat;

  @OneToMany(() => Post, (post) => post.user)
  @Field(() => [Post])
  posts?: Post[];
}
