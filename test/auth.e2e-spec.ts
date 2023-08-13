import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from './../src/config/config.service';
import { Repository } from 'typeorm';
import { AuthModule } from './../src/auth/auth.module';
import { Auth } from './../src/auth/auth.entity';
import { AuthService } from './../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtHandle } from './../src/auth/utils/jwt-handle';
import * as bcrypt from 'bcryptjs';

const moduleMocker = new ModuleMocker(global);
const registerResult = {
  name: 'acarrera',
  email: 'acarrera@mail.com',
  password: '$2a$10$EAXzNsMCNF1c/EbCQsmjPOj4nvuiRbeUzEBf2i4EYMtgWxJH6bAZ6',
  id: 1,
};

const loginResult = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkxODI2MTQ3LCJleHAiOjE2OTE4NDA1NDd9.6-B9KSeKG9fayD-ISutZGH2Zq3baa6dY48ZlbRwnE4A',
  user: {
    id: 1,
    name: 'acarrera',
    email: 'acarrera@mail.com',
  },
};

const registerReq = {
  name: 'acarrera',
  email: 'acarrera@mail.com',
  password: '123456',
};

const loginReq = {
  email: 'acarrera@mail.com',
  password: '123456',
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkxODI2MTQ3LCJleHAiOjE2OTE4NDA1NDd9.6-B9KSeKG9fayD-ISutZGH2Zq3baa6dY48ZlbRwnE4A';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Auth>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Auth]),
      ],
      providers: [JwtService, JwtHandle],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(registerResult),
            login: jest.fn().mockResolvedValue(loginResult),
          };
        }
        if (token === bcrypt) {
          return {
            hash: jest
              .fn()
              .mockResolvedValue(
                '$2a$10$EAXzNsMCNF1c/EbCQsmjPOj4nvuiRbeUzEBf2i4EYMtgWxJH6bAZ6',
              ),
            compare: jest.fn().mockResolvedValue(true),
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

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<Auth>>(getRepositoryToken(Auth));
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    jest
      .spyOn(repository, 'findOne')
      .mockImplementation(() => Promise.resolve(registerResult));
    jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginReq)
      .expect(201)
      .expect(loginResult);
  });

  it('/auth/register (POST)', async () => {
    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(registerResult));
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerReq)
      .expect(201)
      .expect(registerResult);
  });
});
