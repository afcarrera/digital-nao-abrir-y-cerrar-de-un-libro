import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '../../config/config.service';
import { Auth } from '../auth.entity';
import { Repository } from 'typeorm';

const user = {
  name: 'acarrera',
  email: 'acarrera@mail.com',
  password: '$2a$10$EAXzNsMCNF1c/EbCQsmjPOj4nvuiRbeUzEBf2i4EYMtgWxJH6bAZ6',
  id: 1,
};
const result = {
  email: 'acarrera@mail.com',
  id: 1,
  name: 'acarrera',
  password: '$2a$10$EAXzNsMCNF1c/EbCQsmjPOj4nvuiRbeUzEBf2i4EYMtgWxJH6bAZ6',
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let repository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Auth]),
      ],
    }).compile();
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    jwtStrategy = new JwtStrategy(repository);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('Validate existing user', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(() => Promise.resolve(user));
      const payload = { id: 1 };
      expect(jwtStrategy.validate(payload)).resolves.toStrictEqual(result);
    });
  });
});
