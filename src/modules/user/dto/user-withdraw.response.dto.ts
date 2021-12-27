import { ApiProperty } from '@nestjs/swagger';

export class UserWithdrawResponse {
  @ApiProperty({})
  serializedTx: string;
}
