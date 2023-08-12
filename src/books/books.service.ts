import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { BookDto } from './book.dto'; 
import { Book } from './book.entity'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>, 
  ) {}

  async findAll(filter): Promise<Book[]> { 
    const book: Book = new Book();
    if (filter.id){
        book.id = filter.id;
    }
    if (filter.title){
        book.title = filter.title;
    }
    if (filter.genre){
        book.genre = filter.genre;
    }
    if (filter.description){
        book.description = filter.description;
    }
    if (filter.author){
        book.author = filter.author;
    }
    if (filter.publisher){
        book.publisher = filter.publisher;
    }
    if (filter.pages){
        book.pages = filter.pages;
    }
    if (filter.image_url){
        book.image_url = filter.image_url;
    }
    return await this.booksRepository.find({where: book}); 
  }

  async findBook(bookId: number): Promise<Book> {
    return await this.booksRepository.findOne({ where: { id: bookId } }); 
  }

  createBook(newBook: BookDto): Promise<Book> {
    return this.booksRepository.save(newBook);
  }

  async deleteBook(bookId: string): Promise<any> {
    return await this.booksRepository.delete({ id: parseInt(bookId) });
  }

  async updateBook(bookId: number, newBook: BookDto): Promise<Book> { 
    let toUpdate = await this.booksRepository.findOne({ where: { id: bookId } }); 
    if (toUpdate === null){
        return toUpdate;
    }
    let updated = Object.assign(toUpdate, newBook); 

    return this.booksRepository.save(updated); 
  }
}