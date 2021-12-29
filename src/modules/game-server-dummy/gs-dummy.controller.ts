import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsGet, ApiHeaderGsPost } from 'src/decorators';
import { GsDepositWithdrawNotifyData, GsNotifyConsumerPayload } from '../treasury-event-consumer/interfaces';
import { GsdValidateGameItemRequest, GsdValidateGameItemResponse } from './dto';

@Controller('game-server-dummy')
@ApiTags('GAME SERVER DUMMY API')
export class GameServerDummyController {
  @Post('/webhook')
  @ApiHeaderGsPost()
  @ApiOperation({
    operationId: 'notifyToGameServer',
    description: 'Notify all on-chain events to Game Server',
  })
  @ApiOkResponse()
  webhook(@Body() dto: GsNotifyConsumerPayload<GsDepositWithdrawNotifyData>) {
    return dto;
  }

  @Post('/validate-game-item')
  @ApiHeaderGsGet()
  @ApiOperation({
    operationId: 'validateGameItem',
  })
  @ApiOkResponse({ type: GsdValidateGameItemResponse })
  validateGameItem(@Body() dto: GsdValidateGameItemRequest) {
    return dto;
  }
}
