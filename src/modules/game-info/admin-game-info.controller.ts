import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators';
import { AdminGetGameInfoResponse, UpdateGameInfoRequest } from './dto';

@ApiTags('Admin')
@Controller('/admin/game-info')
export class AdminGameInfoController {
  @Get()
  @Authorize()
  @ApiOperation({
    operationId: 'adminGetGameInfo',
    description: 'Admin Get Game Info',
  })
  @ApiOkResponse({
    type: AdminGetGameInfoResponse,
  })
  getGameInfo() {
    //
  }

  @Put()
  @Authorize()
  @ApiOperation({
    operationId: 'updateGameInfo',
    description: 'Admin update game info',
  })
  @ApiOkResponse({
    type: AdminGetGameInfoResponse,
  })
  update(@Body() dto: UpdateGameInfoRequest) {
    return dto;
  }
}
