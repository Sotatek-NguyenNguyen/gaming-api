import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { BaseResponseDto, PaginationResponseDto } from 'src/common/dto';
import { IsString } from 'src/decorators/validators';

export class GsGameItemResponse extends BaseResponseDto {
  @ApiProperty({})
  @AutoMap()
  name: string;

  @ApiProperty({})
  @AutoMap()
  userAddress: string;

  @ApiProperty({})
  @AutoMap()
  image: string;
}

export class CreateGsGameItemRequest {
  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty({})
  @IsString()
  userAddress: string;

  @ApiProperty({})
  @IsUrl()
  @IsNotEmpty()
  image: string;
}

export class ListGsGameItemResponse extends PaginationResponseDto {
  @ApiProperty({ type: [GsGameItemResponse] })
  data: GsGameItemResponse[];
}
