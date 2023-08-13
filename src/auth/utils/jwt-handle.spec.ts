import { JwtService } from '@nestjs/jwt';
import { JwtHandle } from './jwt-handle';

describe('JwtHandle', () => {
  it('should be defined', () => {
    const jwtService: JwtService = new JwtService();
    expect(new JwtHandle(jwtService)).toBeDefined();
  });
});
