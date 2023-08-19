import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);
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
describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
    })
      .useMocker((token) => {
        if (token === BooksService) {
          return {
            findAll: jest.fn().mockResolvedValue(results),
            findBook: jest.fn().mockResolvedValue(result),
            createBook: jest.fn().mockResolvedValue(result),
            updateBook: jest.fn().mockResolvedValue(result),
            deleteBook: jest.fn().mockResolvedValue(resultDelete),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      expect(await controller.findAll(result)).toBe(results);
    });
  });

  describe('findBook', () => {
    it('should return a book', async () => {
      expect(await controller.findBook(3)).toBe(result);
    });
  });

  describe('createBook', () => {
    it('should return a book', async () => {
      expect(await controller.createBook(result)).toBe(result);
    });
  });

  describe('updateBook', () => {
    it('should return a book', async () => {
      expect(await controller.updateBook(3, result)).toBe(result);
    });
  });

  describe('deleteBook', () => {
    it('should return delete info', async () => {
      expect(await controller.deleteBook('3')).toBe(resultDelete);
    });
  });
});
