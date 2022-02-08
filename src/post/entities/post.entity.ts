import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id?: number;

  @Column()
  @Field(() => String)
  title: string;

  @Column('text')
  @Field(() => String)
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @Field(() => User)
  user?: User;

  @Column()
  @Field(() => Int)
  userId: number;
}
