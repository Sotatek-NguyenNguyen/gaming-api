import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameInfoBaseResponse } from './dto';

@ApiTags('Public Api')
@Controller('game-info')
export class GameInfoController {
  @Get()
  @ApiOperation({
    operationId: 'getGameInfo',
    description: 'Get game info  to show in game home page ',
  })
  @ApiOkResponse({
    type: GameInfoBaseResponse,
  })
  getGameInfo() {
    //
  }
}
