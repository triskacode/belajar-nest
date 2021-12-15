import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
  ) {}

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);

    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUserDtoHashed = await this.usersMapper.mapCreateUserDto(
      createUserDto,
    );

    return await this.usersRepository.save<User>(createUserDtoHashed);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    user.email = updateUserDto.email ?? user.email;

    return await this.usersRepository.save<User>(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return this.usersRepository.remove(user);
  }
}
