import { ApiProperty } from '@nestjs/swagger';

export class TokenInfoResponse {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalSupply: number;
}
