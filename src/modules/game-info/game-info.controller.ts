import { MapInterceptor } from '@automapper/nestjs';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameInfoBaseResponse } from './dto';
import { GameInfo } from './game-info.schema';
import { GameInfoService } from './game-info.service';

@ApiTags('Public Api')
@Controller('game-info')
export class GameInfoController {
  constructor(readonly gameInfoService: GameInfoService) {}

  @Get()
  @ApiOperation({
    operationId: 'getGameInfo',
    description: 'Get game info  to show in game home page ',
  })
  @ApiOkResponse({
    type: GameInfoBaseResponse,
  })
  @UseInterceptors(MapInterceptor(GameInfoBaseResponse, GameInfo))
  getGameInfo() {
    return this.gameInfoService.get();
  }
}
