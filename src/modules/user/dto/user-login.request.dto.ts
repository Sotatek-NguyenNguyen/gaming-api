import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class UserLoginRequest {
  @ApiProperty({ example: 'username@domain.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}
