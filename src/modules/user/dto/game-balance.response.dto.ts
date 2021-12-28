import { ApiProperty } from '@nestjs/swagger';

export class GameBalanceResponse {
  @ApiProperty({ example: 1000000 })
  actualGameBalance: string;

  @ApiProperty({ example: 700000 })
  inGameBalance: string;
}
