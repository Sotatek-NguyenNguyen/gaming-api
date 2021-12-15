import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto';

export class NftItemResponse extends BaseResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  referenceId: string;

  @ApiProperty()
  address: string;
}
