import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class StatisticData {
  @ApiProperty({ example: 120 })
  amount: number;

  @ApiProperty({ example: 8 })
  change: number;
}

export class overviewStatistic {
  @ApiProperty()
  depositLast24Hours: StatisticData;

  @ApiProperty()
  @AutoMap()
  depositOneDayAgo: StatisticData;

  @ApiProperty()
  depositSevenDaysAgo: StatisticData;

  @ApiProperty()
  withdrawnLast24Hours: StatisticData;

  @ApiProperty()
  withdrawnOneDayAgo: StatisticData;

  @ApiProperty()
  withdrawnSevensDayAgo: StatisticData;

  @ApiProperty()
  newUserLast24Hours: StatisticData;

  @ApiProperty()
  newUserOneDayAgo: StatisticData;

  @ApiProperty()
  newUserSevensDayAgo: StatisticData;
}
