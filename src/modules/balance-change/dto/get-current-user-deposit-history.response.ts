import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto, PaginationResponseDto } from 'src/common/dto';
import { BalanceChangeType } from '../balance-change.enum';

export class BalanceChangesResponse extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  userAddress: string;

  @ApiProperty({ example: 1 })
  @AutoMap()
  amount: number;

  @ApiProperty({ example: '3MNh8ihk5XfweiJvBdQtLkecnbGvzA6p7vQESuqCvC5fVZ7mLoadytJwdVg9XpVfBTvsnQbUZ9eumvqST7vJ3RMT' })
  @AutoMap()
  transactionId: string;

  @ApiProperty({ enum: BalanceChangeType })
  @AutoMap()
  type: BalanceChangeType;

  @ApiPropertyOptional()
  @AutoMap()
  note?: string;
}

export class ListBalanceChangesResponse extends PaginationResponseDto {
  @ApiProperty({ type: [BalanceChangesResponse] })
  data: BalanceChangesResponse[];
}
