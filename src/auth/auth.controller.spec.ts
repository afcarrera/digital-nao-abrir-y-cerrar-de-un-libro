import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

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

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(registerResult),
            login: jest.fn().mockResolvedValue(loginResult),
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleRegister', () => {
    it('should return a registered user', async () => {
      expect(await controller.handleRegister(registerReq)).toBe(registerResult);
    });
  });

  describe('handleLogin', () => {
    it('should return a registered user and a token', async () => {
      expect(await controller.handleLogin(loginReq)).toBe(loginResult);
    });
  });
});
