import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'src/decorators/validators';

export class AdminWithdrawRequest {
  @ApiProperty({})
  @IsString()
  userAddress: string;

  @ApiProperty({ example: 1 })
  @IsNumber({ positive: true })
  amount: number;
}
