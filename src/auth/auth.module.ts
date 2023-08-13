import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtHandle } from './utils/jwt-handle';
import { Auth } from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '4h' },
          secret: process.env.JWT_SECRET,
        };
      },
    }),
    TypeOrmModule.forFeature([Auth]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtHandle],
  exports: [JwtHandle],
})
export class AuthModule {}
