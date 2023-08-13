import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class Auth {
  @ApiProperty({ example: 99 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'acarrera' })
  @Column()
  name: string;

  @ApiProperty({ example: 'acarrera@mail.com' })
  @Column()
  email: string;

  @ApiProperty({
    example: '$2a$10$dMxmWOXKKLHOQm7LOIl.Z.2Zvt7MdUYRfKshfzCgjSVQnI3DVVJTO',
  })
  @Column()
  password: string;
}
