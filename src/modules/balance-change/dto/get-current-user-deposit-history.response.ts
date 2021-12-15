import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto, PaginationResponseDto } from 'src/common/dto';
import { BalanceChangeType } from '../balance-change.enum';

export class BalanceChangesResponse extends BaseResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ example: 1 })
  amount: number;

  @ApiProperty({ example: '3MNh8ihk5XfweiJvBdQtLkecnbGvzA6p7vQESuqCvC5fVZ7mLoadytJwdVg9XpVfBTvsnQbUZ9eumvqST7vJ3RMT' })
  transactionId: string;

  @ApiProperty({ enum: BalanceChangeType })
  type: BalanceChangeType;
}

export class ListBalanceChangesResponse extends PaginationResponseDto {
  @ApiProperty({ type: [BalanceChangesResponse] })
  data: BalanceChangesResponse[];
}
