import { IsEmail, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ValidateIf((object, value) => value !== undefined)
  @IsEmail()
  email?: string;
}
