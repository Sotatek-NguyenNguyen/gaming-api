import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto, PaginationResponseDto } from 'src/common/dto';
import { IsString } from 'src/decorators/validators';

export class PlayerResponse extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  walletAddress: string;

  @ApiProperty({})
  @AutoMap()
  name: string;
}

export class CreatePlayerRequest {
  @ApiProperty({})
  @IsString()
  name: string;
}

export class ListPlayerResponse extends PaginationResponseDto {
  @ApiProperty({ type: [PlayerResponse] })
  data: PlayerResponse[];
}
