import { MapInterceptor } from '@automapper/nestjs';
import { Body, Controller, Get, Put, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { Authorize } from 'src/decorators';
import { AdminGetGameInfoResponse, UpdateGameInfoRequest } from './dto';
import { GameInfo } from './game-info.schema';
import { GameInfoService } from './game-info.service';

@ApiTags('Admin')
@Controller('/admin/game-info')
@Authorize(UserRole.Admin)
export class AdminGameInfoController {
  constructor(readonly gameInfoService: GameInfoService) {}

  @Get()
  @ApiOperation({
    operationId: 'adminGetGameInfo',
    description: 'Admin Get Game Info',
  })
  @ApiOkResponse({
    type: AdminGetGameInfoResponse,
  })
  @UseInterceptors(MapInterceptor(AdminGetGameInfoResponse, GameInfo))
  getGameInfo() {
    return this.gameInfoService.get();
  }

  @Put()
  @ApiOperation({
    operationId: 'updateGameInfo',
    description: 'Admin update game info',
  })
  @ApiOkResponse({
    type: AdminGetGameInfoResponse,
  })
  @UseInterceptors(MapInterceptor(AdminGetGameInfoResponse, GameInfo))
  update(@Body() dto: UpdateGameInfoRequest) {
    return this.gameInfoService.update(dto);
  }
}
