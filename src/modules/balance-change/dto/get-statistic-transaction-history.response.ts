import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatisticData } from 'src/common/dto';
import { BalanceChangeType } from '../balance-change.enum';

export class TransactionStatistic {
  @ApiProperty()
  @AutoMap()
  depositLast24Hours: StatisticData;

  @ApiProperty()
  @AutoMap()
  depositOneDayAgo: StatisticData;

  @ApiProperty()
  @AutoMap()
  depositSevenDayAgo: StatisticData;

  @ApiProperty()
  @AutoMap()
  withdrawnLast24Hours: StatisticData;

  @ApiPropertyOptional()
  @AutoMap()
  withdrawnOneDayAgo: StatisticData;

  @ApiPropertyOptional()
  @AutoMap()
  withdrawnSevenDayAgo: StatisticData;
}
