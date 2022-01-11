import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'src/decorators/validators';

export class AdminGrantTokenRequest {
  @ApiProperty({ example: 1 })
  @IsNumber({ positive: true, integer: true })
  amount: number;

  @ApiProperty()
  @IsString()
  userAddress: string;

  @ApiPropertyOptional()
  @IsString({ optional: true })
  note: string;
}
