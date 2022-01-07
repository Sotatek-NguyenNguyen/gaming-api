import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto';
import { NftItemStatus } from '../enum';

export class NftItemResponse extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  userAddress: string;

  @ApiProperty()
  @AutoMap()
  gameItemId: string;

  @ApiProperty()
  @AutoMap()
  gameItemName: string;

  @ApiProperty()
  @AutoMap()
  address: string;

  @ApiProperty({ enum: NftItemStatus })
  @AutoMap()
  status: NftItemStatus;
}
