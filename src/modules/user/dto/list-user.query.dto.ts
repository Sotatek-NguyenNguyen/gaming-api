import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto';
import { IsString } from 'src/decorators/validators';

export class ListUserQuery extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsString({ optional: true })
  address: string;

  @ApiPropertyOptional()
  @IsString({ optional: true })
  accountInGameId: string;
}
