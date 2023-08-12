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
  
  @Controller('books')
  @UseGuards(AuthGuard('jwt'))
  export class BooksController {
  
    constructor(private booksService: BooksService) {}
  
    @Post('filter')
    findAll(@Req() request: Request): Promise<Book[]> { 
      const filter: BookDto = request.body;
      return this.booksService.findAll(filter);
    }
  
    @Get(':bookId')
    findBook(@Param('bookId') bookId: number): Promise<Book> {
      return this.booksService.findBook(bookId);
    }
  
    @Post()
    createBook(@Body() newBook: BookDto): Promise<Book> { 
      return this.booksService.createBook(newBook);
    }
  
    @Delete(':bookId')
    deleteBook(@Param('bookId') bookId: string): Promise<Book> {
      return this.booksService.deleteBook(bookId);
    }
  
  
    @Put(':bookId')
    updateBook(
      @Param('bookId') bookId: number,
      @Body() newBook: BookDto, 
    ): Promise<Book> {
      return this.booksService.updateBook(bookId, newBook);
    }
  }