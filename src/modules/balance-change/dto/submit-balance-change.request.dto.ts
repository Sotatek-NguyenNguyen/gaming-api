import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'src/decorators/validators';

class SubmitBalanceChange {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNumber({})
  amount: number;
}

export class SubmitBalanceChangeRequest {
  @ApiProperty({ type: [SubmitBalanceChange] })
  balanceChanges: SubmitBalanceChange[];
}

export class SubmitBalanceChangeResponse {
  @ApiProperty()
  success: boolean;
}
