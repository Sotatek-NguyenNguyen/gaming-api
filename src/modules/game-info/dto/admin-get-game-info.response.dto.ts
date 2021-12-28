import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { GameInfoBaseResponse } from '.';

export class AdminGetGameInfoResponse extends GameInfoBaseResponse {
  @ApiProperty()
  @AutoMap()
  walletAddress: string;
}
