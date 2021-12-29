import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { GameInfoBaseResponse } from '.';

export class AdminGetGameInfoResponse extends GameInfoBaseResponse {
  @ApiProperty({ example: 'https://api-gaming.dev.gamifyclub.com/game-server-dummy/webhook' })
  @AutoMap()
  webhookUrl: string;

  @ApiProperty({ example: 'https://api-gaming.dev.gamifyclub.com/game-server-dummy/validate-game-item' })
  @AutoMap()
  getItemUrl: string;
}
