import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto';

export class UserResponse extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  address: string;

  @ApiProperty()
  @AutoMap()
  accountInGameId: string;

  @ApiProperty()
  @AutoMap()
  email: string;

  @ApiProperty()
  balance: number;
}
