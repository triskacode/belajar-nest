import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Chat } from 'src/chat/entities/chat.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);

    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUserDtoHashed = await this.userMapper.mapCreateUserDto(
      createUserDto,
    );

    const user: User = { ...createUserDtoHashed, chat: new Chat() };

    return await this.userRepository.save<User>(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    user.email = updateUserDto.email ?? user.email;

    return await this.userRepository.save<User>(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.remove(user);
  }
}