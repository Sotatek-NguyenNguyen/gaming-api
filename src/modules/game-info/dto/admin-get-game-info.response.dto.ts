import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { GameInfoBaseResponse } from '.';

export class AdminGetGameInfoResponse extends GameInfoBaseResponse {
  @ApiProperty({ example: 'SLP' })
  @AutoMap()
  currencyCode: string;

  @ApiProperty({ example: 'Small Love Potion' })
  @AutoMap()
  currencyName: string;

  @ApiProperty()
  @AutoMap()
  walletAddress: string;
}
