import {
  Controller,
  Get,
  Param,
  Req,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Request } from 'express';
import { BookDto } from './book.dto';
import { Book } from './book.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {
  constructor(private booksService: BooksService) {}

  /**
   *
   * @returns {Book[]} Devuelve una lista de libros
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Post('filter')
  @ApiOperation({ summary: 'Obtener lista de libros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de libros',
    type: [Book],
  })
  findAll(@Req() request: Request): Promise<Book[]> {
    const filter: Book = request.body;
    return this.booksService.findAll(filter);
  }

  /**
   *
   * @returns {Book} Devuelve un libro
   * @param {number} bookId Id del libro a buscar
   */
  @Get(':bookId')
  @ApiOperation({ summary: 'Obtener un libro' })
  @ApiResponse({
    status: 200,
    description: 'Libros',
    type: Book,
  })
  findBook(@Param('bookId') bookId: number): Promise<Book> {
    return this.booksService.findBook(bookId);
  }

  /**
   *
   * @returns {Book} Devuelve el libro creado con su id
   * @param {BookDto} newBook Libro a crear
   */
  @Post()
  @ApiOperation({ summary: 'Crear un libro' })
  @ApiResponse({
    status: 201,
    description: 'Crear libro',
    type: Book,
  })
  createBook(@Body() newBook: BookDto): Promise<Book> {
    return this.booksService.createBook(newBook);
  }

  /**
   *
   * @returns
   * @param {string} bookId Libro a crear
   */
  @Delete(':bookId')
  @ApiOperation({ summary: 'Elimina un libro' })
  @ApiResponse({
    status: 200,
    description: 'Elimina libro',
  })
  deleteBook(@Param('bookId') bookId: string): Promise<Book> {
    return this.booksService.deleteBook(bookId);
  }

  /**
   *
   * @returns {Book} Devuelve el libro actualizado
   * @param {number} bookId Id del libro a actualizar
   * @param {BookDto} newBook Libro a actualizar
   */
  @Put(':bookId')
  @ApiOperation({ summary: 'Actualizar un libro' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar libro',
    type: Book,
  })
  updateBook(
    @Param('bookId') bookId: number,
    @Body() newBook: BookDto,
  ): Promise<Book> {
    return this.booksService.updateBook(bookId, newBook);
  }
}
