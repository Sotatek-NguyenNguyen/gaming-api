import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponse {
  @ApiProperty({ example: 'username@domain.com' })
  email: string;

  @ApiProperty({ example: -1 })
  status: number;

  @ApiProperty({ example: 'Email not accepted' })
  message: string;
}
