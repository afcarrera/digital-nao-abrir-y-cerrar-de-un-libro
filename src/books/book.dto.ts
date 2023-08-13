import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BookDto {
  @ApiProperty({ example: 'Don Quijote de la Mancha' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;
  @ApiProperty({ example: 'Novela' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly genre: string;
  @ApiProperty({
    example: 'Esta edición del Ingenioso hidalgo don Quijote de la Mancha ...',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly description: string;
  @ApiProperty({ example: 'Miguel de Cervantes' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly author: string;
  @ApiProperty({ example: 'Santillana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly publisher: string;
  @ApiProperty({ example: 592 })
  @IsInt()
  @IsNotEmpty()
  readonly pages: number;
  @ApiProperty({ example: 'www.imagen.com/quijote.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly image_url: string;
}
