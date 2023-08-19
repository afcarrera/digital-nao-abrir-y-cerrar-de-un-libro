import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { configService } from '../config/config.service';
import { JwtService } from '@nestjs/jwt';
import { JwtHandle } from './utils/jwt-handle';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

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

const loginReqBadPass = {
  email: 'acarrera@mail.com',
  password: 'badPass',
};

const resultBadPass = {
  name: 'acarrera',
  email: 'acarrera@mail.com',
  password: '$2a$10$EAXzNsMCNF1c/EbCQsmjPOj4nvuiRbeUzEBf2i4EYMtgWxJH6bAZ6',
  id: 1,
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkxODI2MTQ3LCJleHAiOjE2OTE4NDA1NDd9.6-B9KSeKG9fayD-ISutZGH2Zq3baa6dY48ZlbRwnE4A';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<Auth>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Auth]),
      ],
      providers: [AuthService, JwtService, JwtHandle],
    })
      .useMocker((token) => {
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

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a registered user and a token', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(registerResult));
      jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
      expect(await service.login(loginReq)).toStrictEqual(loginResult);
    });
  });

  describe('loginBadPass', () => {
    it('should return HttpException', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(resultBadPass));
      try {
        await service.login(loginReqBadPass);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('loginNotFound', () => {
    it('should return HttpException', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));
      try {
        await service.login(loginReq);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('register', () => {
    it('should return a registered user', async () => {
      jest
        .spyOn(repository, 'save')
        .mockImplementation(() => Promise.resolve(registerResult));
      expect(await service.register(registerReq)).toBe(registerResult);
    });
  });
});
