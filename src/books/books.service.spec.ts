import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configService } from '../config/config.service';
import { HttpException } from '@nestjs/common';

const results = [
  {
    id: 3,
    title: 'El enigma de la habitación 622',
    genre: 'Ficción contemporánea',
    description:
      'Vuelve el «principito de la literatura negra contemporánea, el niño mimado de la industria literaria» (GQ): el nuevo thriller de Joël Dicker es su novela más personal. ',
    author: 'Joël Dicker',
    publisher: 'Alfaguara',
    pages: 624,
    image_url:
      'https://images-na.ssl-images-amazon.com/images/I/41KiZbwOhhL._SX315_BO1,204,203,200_.jpg',
  },
];
const result = {
  id: 3,
  title: 'El enigma de la habitación 622',
  genre: 'Ficción contemporánea',
  description:
    'Vuelve el «principito de la literatura negra contemporánea, el niño mimado de la industria literaria» (GQ): el nuevo thriller de Joël Dicker es su novela más personal. ',
  author: 'Joël Dicker',
  publisher: 'Alfaguara',
  pages: 624,
  image_url:
    'https://images-na.ssl-images-amazon.com/images/I/41KiZbwOhhL._SX315_BO1,204,203,200_.jpg',
};
const resultDelete = {
  raw: [],
  affected: 0,
};
describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Book]),
      ],
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementation(() => Promise.resolve(results));
      expect(await service.findAll(result)).toBe(results);
    });
  });

  describe('findBook', () => {
    it('should return a book', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.findBook(3)).toBe(result);
    });
  });

  describe('findBookNotFound', () => {
    it('should return a HttpException', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));
      try {
        await service.findBook(3);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('createBook', () => {
    it('should return a book', async () => {
      jest
        .spyOn(repository, 'save')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.createBook(result)).toBe(result);
    });
  });

  describe('updateBook', () => {
    it('should return a book', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      jest
        .spyOn(repository, 'save')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.updateBook(3, result)).toBe(result);
    });
  });

  describe('updateBookNotFound', () => {
    it('should return HttpException', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));
      try {
        await service.updateBook(3, result);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('deleteBook', () => {
    it('should return delete info', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockImplementation(() => Promise.resolve(resultDelete));
      expect(await service.deleteBook('3')).toBe(resultDelete);
    });
  });
});
