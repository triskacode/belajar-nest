import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';
import { Match } from '../validators/match.validator';
import { Unique } from '../validators/unique.validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Unique(User)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Match('password')
  confirmPassword: string;
}
