import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';
import { IsEnum, IsString } from 'src/decorators/validators';
import { BalanceChangeType } from '../balance-change.enum';

// must be partial of BalanceChangeType
// used only for validation and docs
export enum TransactionType {
  Deposit = 'deposit',
  Withdrawn = 'withdrawn',
  AdminGrant = 'admin_grant',
  AdminDeduct = 'admin_deduct',
}

// must be partial of BalanceChangeType
// used only for validation and docs
export enum InGameBalanceChangeType {
  InGameIncrease = 'in_game_increase',
  InGameDecrease = 'in_game_decrease',
}

export class ListUserTransactionHistoryQuery extends PaginationQueryDto {
  @ApiPropertyOptional({ example: '2021-12-13T14:46:45.044+07:00' })
  @IsDateString()
  @IsOptional()
  fromDate: Date;

  @ApiPropertyOptional({ example: '2021-12-13T14:46:45.044+07:00' })
  @IsDateString()
  @IsOptional()
  toDate: Date;

  @ApiPropertyOptional({
    example: '3MNh8ihk5XfweiJvBdQtLkecnbGvzA6p7vQESuqCvC5fVZ7mLoadytJwdVg9XpVfBTvsnQbUZ9eumvqST7vJ3RMT',
  })
  @IsString({ optional: true })
  transactionId: string;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsEnum({ optional: true, entity: TransactionType })
  type?: BalanceChangeType;
}

export class ListUserInGameBalanceChangeHistoryQuery extends PaginationQueryDto {
  @ApiPropertyOptional({ example: '2021-12-13T14:46:45.044+07:00' })
  @IsDateString()
  @IsOptional()
  fromDate: Date;

  @ApiPropertyOptional({ example: '2021-12-13T14:46:45.044+07:00' })
  @IsDateString()
  @IsOptional()
  toDate: Date;

  @ApiPropertyOptional({ enum: InGameBalanceChangeType })
  @IsEnum({ optional: true, entity: InGameBalanceChangeType })
  type?: BalanceChangeType;
}

export class AdminListUserTransactionHistoryQuery extends ListUserTransactionHistoryQuery {
  @ApiPropertyOptional()
  @IsString({ optional: true })
  userAddress: string;
}

export class AdminListUserInGameBalanceChangeHistoryQuery extends ListUserInGameBalanceChangeHistoryQuery {
  @ApiPropertyOptional()
  @IsString({ optional: true })
  userAddress: string;
}
