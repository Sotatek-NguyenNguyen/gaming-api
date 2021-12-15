import { ApiProperty } from '@nestjs/swagger';

export class WithdrawResponse {
  @ApiProperty()
  success: boolean;
}
