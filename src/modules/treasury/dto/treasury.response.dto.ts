import { ApiProperty } from '@nestjs/swagger';

export class TreasuryResponse {
  @ApiProperty()
  balance: number;
}
