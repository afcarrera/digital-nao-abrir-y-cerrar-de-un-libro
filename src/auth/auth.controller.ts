import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './auth.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @returns {Auth} Devuelve un usuario registrado con la contraseña encriptada
   * @param {RegisterAuthDto} registerBody usuario a crear
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({
    status: 201,
    description: 'Registrar usuario',
    type: Auth,
  })
  handleRegister(@Body() registerBody: RegisterAuthDto) {
    return this.authService.register(registerBody);
  }

  /**
   *
   * @returns {Auth} Devuelve un token
   * @param {LoginAuthDto} loginBody usuario a iniciar sesión
   */
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 201,
    description: 'Iniciar sesión',
    type: Auth,
  })
  handleLogin(@Body() loginBody: LoginAuthDto) {
    return this.authService.login(loginBody);
  }
}
