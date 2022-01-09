import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'src/decorators/validators';

export class GsSubmitBalanceChangeRequest {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNumber({ integer: true })
  amount: number;
}
