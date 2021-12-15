import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'src/decorators/validators';

export class WithdrawRequest {
  @ApiProperty({ example: 1 })
  @IsNumber({ positive: true })
  amount: number;
}
