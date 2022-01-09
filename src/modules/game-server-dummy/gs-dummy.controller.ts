import { MapInterceptor } from '@automapper/nestjs';
import { BadRequestException, Body, Controller, Get, Headers, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto';
import { http } from 'src/common/http';
import { ApiHeaderGsGet, ApiHeaderGsPost } from 'src/decorators';
import { v4 as uuidv4 } from 'uuid';
import { SubmitBalanceChange } from '../balance-change/dto';
import { OtpRequest } from '../otp/dto/otp.request.dto';
import { ApiConfigService, GsHelperService } from '../shared/services';
import { GsDepositWithdrawNotifyData, GsNotifyConsumerPayload } from '../treasury-event-consumer/interfaces';
import {
  CreateGsGameItemRequest,
  GsdValidateGameItemRequest,
  GsdValidateGameItemResponse,
  GsGameItemResponse,
  ListGsGameItemResponse,
} from './dto';
import { CreatePlayerRequest, ListPlayerResponse, PlayerResponse } from './dto/gsd-player.dto';
import { GameServerDummyService } from './gs-dummy.service';
import { GsGameItem, GsPlayer } from './schema';

@Controller('game-server-dummy')
@ApiTags('GAME SERVER DUMMY API')
export class GameServerDummyController {
  constructor(
    readonly service: GameServerDummyService,
    readonly configService: ApiConfigService,
    readonly gsHelperService: GsHelperService,
  ) {}

  @Post('/webhook')
  @ApiHeaderGsPost()
  @ApiOperation({
    operationId: 'notifyToGameServer',
    description: 'Notify all on-chain events to Game Server',
  })
  @ApiOkResponse()
  webhook(
    @Body() dto: GsNotifyConsumerPayload<GsDepositWithdrawNotifyData>,
    @Headers('x-signature') signature: string,
  ) {
    if (signature !== this.gsHelperService.generateSignature(dto)) {
      throw new BadRequestException('X-SIGNASTURE_IS_INVALID');
    }

    return this.service.handleEventFromGaming(dto);
  }

  @Post('/validate-game-item')
  @ApiHeaderGsGet()
  @ApiOperation({
    operationId: 'validateGameItem',
  })
  @ApiOkResponse({ type: GsdValidateGameItemResponse })
  validateGameItem(@Body() dto: GsdValidateGameItemRequest, @Headers('x-access-key') accessKey: string) {
    if (accessKey !== this.configService.gsKey.accessKey) {
      throw new BadRequestException('X-ACCESS-KEY_IS_INVALID');
    }
    return this.service.validateGameItem(dto);
  }

  @Get('/players')
  @ApiOperation({
    operationId: 'gs.listPlayers',
  })
  @ApiOkResponse({ type: ListPlayerResponse })
  listPlayer(@Query() query: PaginationQueryDto) {
    return this.service.getListPlayer(query);
  }

  @Post('/players')
  @ApiOperation({
    operationId: 'gs.createPlayer',
  })
  @ApiOkResponse({ type: PlayerResponse })
  @UseInterceptors(MapInterceptor(PlayerResponse, GsPlayer))
  createPlayer(@Body() dto: CreatePlayerRequest) {
    return this.service.createPlayer(dto);
  }

  @Get('/game-item')
  @ApiOperation({
    operationId: 'gs.listGameItem',
  })
  @ApiOkResponse({ type: ListGsGameItemResponse })
  getListGameItem(@Query() query: PaginationQueryDto) {
    return this.service.getListGameItem(query);
  }

  @Post('/game-item')
  @ApiOperation({
    operationId: 'gs.createGameItem',
  })
  @ApiOkResponse({ type: GsGameItemResponse })
  @UseInterceptors(MapInterceptor(GsGameItemResponse, GsGameItem))
  createGameItem(@Body() dto: CreateGsGameItemRequest) {
    return this.service.createGameItem(dto);
  }

  @Post('/otp')
  @ApiOperation({
    operationId: 'gs.otp',
  })
  handleOtp(@Body() dto: OtpRequest) {
    const signature = this.gsHelperService.generateSignature(dto);

    try {
      return http.post(`http://localhost:${this.configService.appConfig.port}/game-server/otp`, dto, {
        headers: {
          'x-signature': signature,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/balance-changes')
  @ApiOperation({
    operationId: 'gs.postBc',
  })
  async submitBc(@Body() dto: SubmitBalanceChange) {
    const data = {
      requestId: uuidv4(),
      balanceChanges: [dto],
    };
    const signature = this.gsHelperService.generateSignature(data);
    try {
      return http.post(`http://localhost:${this.configService.appConfig.port}/game-server/balances-changes`, data, {
        headers: {
          'x-signature': signature,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
