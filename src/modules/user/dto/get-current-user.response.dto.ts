import { ApiProperty } from '@nestjs/swagger';

export class GetCurrentUserResponse {
  @ApiProperty({
    example: 1,
  })
  balance: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  accountInGameId: string;
}
