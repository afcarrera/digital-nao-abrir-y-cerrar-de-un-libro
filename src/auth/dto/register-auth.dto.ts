import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterAuthDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'acarrera@mail.com' })
  email: string;

  @Length(3, 20)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'acarrera' })
  name: string;

  @Length(6, 20)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string;
}
