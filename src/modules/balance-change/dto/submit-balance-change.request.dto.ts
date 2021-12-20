import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'src/decorators/validators';

class SubmitBalanceChange {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNumber({})
  amount: number;
}

export class SubmitBalanceChangeRequest {
  @ApiProperty()
  @IsString()
  requestId: string;

  @ApiProperty({ type: [SubmitBalanceChange] })
  @IsArray({ nestedValidate: true, nestedType: SubmitBalanceChange })
  balanceChanges: SubmitBalanceChange[];
}

export class SubmitBalanceChangeResponse {
  @ApiProperty()
  success: boolean;
}
