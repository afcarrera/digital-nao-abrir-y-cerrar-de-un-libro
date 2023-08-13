import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BooksModule } from './../src/books/book.module';
import { BooksService } from './../src/books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './../src/config/config.service';
import { Book } from './../src/books/book.entity';
import { AuthGuard } from '@nestjs/passport';

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

const mokeGuard: CanActivate = {
  canActivate: () => {
    return true;
  },
};

const booksService = {
  findAll: () => results,
  findBook: () => result,
  createBook: () => result,
  updateBook: () => result,
  deleteBook: () => resultDelete,
};

describe('BookController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BooksModule,
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Book]),
      ],
    })
      .overrideProvider(BooksService)
      .useValue(booksService)
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mokeGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/books/filter (POST)', async () => {
    return request(app.getHttpServer()).post('/books/filter').expect(201);
  });

  it('/books/{id} (GET)', async () => {
    return request(app.getHttpServer()).get('/books/1').expect(200);
  });

  it('/books (POST)', async () => {
    return request(app.getHttpServer()).post('/books').expect(201);
  });

  it('/books/{id} (PUT)', async () => {
    return request(app.getHttpServer()).put('/books/1').expect(200);
  });

  it('/books/{id} (DELETE)', async () => {
    return request(app.getHttpServer()).delete('/books/1').expect(200);
  });
});
