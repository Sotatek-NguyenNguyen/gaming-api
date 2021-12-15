import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';
import { ListUserInGameBalanceChangeHistoryQuery, ListUserTransactionHistoryQuery } from '.';

export class ListTransactionHistoryQuery extends ListUserTransactionHistoryQuery {
  @ApiPropertyOptional()
  @IsString({ optional: true })
  userId?: string;
}

export class ListInGameBalanceChangeHistoryQuery extends ListUserInGameBalanceChangeHistoryQuery {
  @ApiPropertyOptional()
  @IsString({ optional: true })
  userId?: string;
}
