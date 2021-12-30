import { ApiProperty } from '@nestjs/swagger';

export class StatisticData {
  @ApiProperty({ example: 120 })
  amount: number;

  @ApiProperty({ example: 8 })
  change: number;
}
