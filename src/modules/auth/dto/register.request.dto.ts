import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class GetSignatureMsgToLoginRequest {
  @ApiProperty()
  @IsString()
  address: string;
}

export class GetSignatureMsgToLoginResponse {
  @ApiProperty()
  signatureMsg: string;
}
