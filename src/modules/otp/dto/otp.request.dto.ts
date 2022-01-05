import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class OtpRequest {
  @ApiProperty()
  @IsString()
  accountInGameId: string;

  @ApiProperty()
  @IsString()
  otp: string;
}
