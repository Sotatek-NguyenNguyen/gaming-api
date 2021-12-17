import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class LoginRequest {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  signature: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
}
