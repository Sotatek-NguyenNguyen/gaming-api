import { ApiProperty } from '@nestjs/swagger';
import { GameInfoBaseResponse } from '.';

export class AdminGetGameInfoResponse extends GameInfoBaseResponse {
  @ApiProperty({ example: 'SLP' })
  currencyCode: string;

  @ApiProperty({ example: 'Small Love Potion' })
  currencyName: string;

  @ApiProperty()
  walletAddress: string;
}

// GAME INFO
// - name
// - videoIntroURL
// - logoURL
// - backgroundURL
// - description
// - gameURL

// currencyCode
// currencyName

// walletAddress
//
