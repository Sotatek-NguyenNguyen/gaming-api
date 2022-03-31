import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class UserOTPRequest {
  @ApiProperty({ example: 'username@domain.com' })
  @IsString()
  email: string;
}
