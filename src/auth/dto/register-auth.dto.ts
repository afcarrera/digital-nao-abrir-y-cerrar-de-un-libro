import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class RegisterAuthDto {
  @IsEmail()
  @ApiProperty({ example: 'acarrera@mail.com' })
  email: string;

  @ApiProperty({ example: 'acarrera' })
  @Length(3, 20)
  name: string;

  @ApiProperty({ example: 'password' })
  @Length(6, 20)
  password: string;
}