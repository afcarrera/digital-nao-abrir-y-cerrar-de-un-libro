import { ApiProperty } from '@nestjs/swagger';
import { Auth } from './auth.entity';

export class AuthToken {

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkyNDI1Nzg3LCJleHAiOjE2OTI0NDAxODd9.OPZ34Jgsn80NVBBDjXXINBYy1KKF5rQOn8CXHhIhqbo' })
  token: string;

  @ApiProperty({ example: {
      'id': 99,
      'name': 'acarrera',
      'email': 'acarrera@mail.com'
    } 
  })
  user: Auth;
}
