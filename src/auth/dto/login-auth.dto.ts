import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'acarrera@mail.com' })
  email: string;

  @Length(6, 20)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password' })
  password: string;
}
