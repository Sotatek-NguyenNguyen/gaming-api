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
  depositSevenDaysAgo: StatisticData;

  @ApiProperty()
  depositLast30Days: StatisticData;

  @ApiProperty()
  withdrawnLast24Hours: StatisticData;

  @ApiProperty()
  withdrawnSevenDaysAgo: StatisticData;

  @ApiProperty()
  withdrawnLast30Days: StatisticData;

  @ApiProperty()
  newUserLast24Hours: StatisticData;

  @ApiProperty()
  newUserSevenDaysAgo: StatisticData;

  @ApiProperty()
  newUserLast30Days: StatisticData;
}
