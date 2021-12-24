import { ApiProperty } from '@nestjs/swagger';

export class TreasuryResponse {
  @ApiProperty({ example: '15796387' })
  balance: string;

  @ApiProperty({ example: 'CKiv6a8wPbvAS4FNg84Gw9A6vqX9k38E1mwAEFyiTkX2' })
  address: string;
}
