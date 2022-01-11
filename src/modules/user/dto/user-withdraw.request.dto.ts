import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'src/decorators/validators';

export class UserWithdrawRequest {
  @ApiProperty({ example: 1 })
  @IsNumber({ positive: true, integer: true })
  amount: number;
}
