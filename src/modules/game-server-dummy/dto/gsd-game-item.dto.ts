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
  symbol: string;

  @ApiProperty({})
  @AutoMap()
  userAddress: string;

  @ApiProperty({})
  @AutoMap()
  image: string;
}

export class CreateGsGameItemRequest {
  @ApiProperty({})
  @IsString({ minLength: 1, maxLength: 32 })
  name: string;

  @ApiProperty({})
  @IsString()
  userAddress: string;

  @ApiProperty({})
  @IsString({ minLength: 1, maxLength: 10 })
  symbol: string;

  @ApiProperty({})
  @IsUrl()
  @IsNotEmpty()
  image: string;
}

export class ListGsGameItemResponse extends PaginationResponseDto {
  @ApiProperty({ type: [GsGameItemResponse] })
  data: GsGameItemResponse[];
}
