import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto';

export class UserResponse extends BaseResponseDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  accountInGameId: string;

  @ApiProperty()
  balance: string;
}
