import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto';

export class NftItemResponse extends BaseResponseDto {
  @ApiProperty()
  userAddress: string;

  @ApiProperty()
  referenceId: string;

  @ApiProperty()
  address: string;
}
