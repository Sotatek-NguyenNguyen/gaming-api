import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto';

export enum TransactionType {
  Deposit = 'deposit',
  Withdrawn = 'withdrawn',
}

export enum InGameBalanceChangeType {
  InGameIncrease = 'in_game_increase',
  InGameDecrease = 'in_game_decrease',
}

export class ListUserTransactionHistoryQuery extends PaginationQueryDto {
  @ApiPropertyOptional({ example: '2021-12-13T14:46:45.044+07:00' })
  fromDate: Date;

  @ApiPropertyOptional({ example: '2021-12-13T14:46:45.044+07:00' })
  toDate: Date;

  @ApiPropertyOptional({
    example: '3MNh8ihk5XfweiJvBdQtLkecnbGvzA6p7vQESuqCvC5fVZ7mLoadytJwdVg9XpVfBTvsnQbUZ9eumvqST7vJ3RMT',
  })
  transactionId: string;

  @ApiPropertyOptional({ enum: TransactionType })
  type?: TransactionType;
}

export class ListUserInGameBalanceChangeHistoryQuery extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: InGameBalanceChangeType })
  type?: InGameBalanceChangeType;
}
