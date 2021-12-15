import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/dto';
import { NftItemResponse } from './nft-item.response.dto';

export class ListNftResponse extends PaginationResponseDto {
  @ApiProperty({
    type: [NftItemResponse],
  })
  data: NftItemResponse[];
}
