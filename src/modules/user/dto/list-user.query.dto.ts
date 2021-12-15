import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto';

export class ListUserQuery extends PaginationQueryDto {
  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  accountInGameId: string;
}
