import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHash, generateHash } from './utils/handleBcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  /**
   * Iniciar sesion
   * @param userLoginBody
   * @returns
   */
  public async login(userLoginBody: LoginAuthDto) {
    const { password } = userLoginBody;

    const userExist = await this.authRepository.findOne({
      where: {
        email: userLoginBody.email,
      },
    });
    if (!userExist) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    const isCheck = await compareHash(password, userExist.password);
    if (!isCheck)
      throw new HttpException('PASSWORD_INVALID', HttpStatus.CONFLICT);

    const userFlat = userExist;
    delete userFlat.password;

    const payload = {
      id: userFlat.id,
    };
    const token = this.jwtService.sign(payload);

    const data = {
      token,
      user: userFlat,
    };

    return data;
  }

  /**
   * Registrar un usuario
   * @param userBody
   * @returns
   */
  public async register(userBody: RegisterAuthDto) {
    const { password, ...user } = userBody;

    const userParse = {
      ...user,
      password: await generateHash(password),
    };
    try{
      const newUser = await this.authRepository.save(userParse);
      return newUser;
    }catch(error){
      throw new HttpException(error.sqlMessage, HttpStatus.CONFLICT);
    }
  }
}
