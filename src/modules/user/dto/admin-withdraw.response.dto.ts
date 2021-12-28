import { ApiProperty } from '@nestjs/swagger';

export class AdminWithdrawResponse {
  @ApiProperty({})
  serializedTx: string;
}
