import { ApiProperty } from '@nestjs/swagger';

export class GameBalanceResponse {
  @ApiProperty({ example: 1000000 })
  actualGameBalance: string;

  @ApiProperty({ example: 700000 })
  allocatedInGameBalance: string;

  @ApiProperty({ example: 700000 })
  unallocatedInGameBalance: string;
}
