import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto';
import { IsEnum, IsString } from 'src/decorators/validators';

export enum UserQuerySortBy {
  CreatedAt = 'createdAt',
  Balance = 'balance',
}

export class ListUserQuery extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsString({ optional: true })
  address: string;

  @ApiPropertyOptional()
  @IsString({ optional: true })
  accountInGameId: string;

  @ApiPropertyOptional({
    enum: UserQuerySortBy,
  })
  @IsEnum({ entity: UserQuerySortBy, optional: true })
  sortBy: UserQuerySortBy;
}
