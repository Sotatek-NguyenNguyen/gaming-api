import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto';

export class NftItemResponse extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  userAddress: string;

  @ApiProperty()
  @AutoMap()
  referenceId: string;

  @ApiProperty()
  @AutoMap()
  address: string;
}
