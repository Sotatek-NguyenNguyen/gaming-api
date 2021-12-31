import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class StatisticData {
  @ApiProperty({ example: 120 })
  amount: number;

  @ApiProperty({ example: 8 })
  change: number;
}

export class OverviewStatistic {
  @ApiProperty()
  depositLast24Hours: StatisticData;

  @ApiProperty()
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
