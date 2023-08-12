import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @ApiProperty({ example: 'acarrera@mail.com' })
  email: string;

  @Length(6, 20)
  @ApiProperty({ example: 'password' })
  password: string;
}