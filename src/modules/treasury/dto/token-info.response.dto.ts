import { ApiProperty } from '@nestjs/swagger';

export class TokenInfoResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ example: '15796387' })
  totalSupply: string;

  @ApiProperty({ example: 9 })
  decimals: number;
}
