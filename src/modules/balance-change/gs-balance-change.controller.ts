import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsGet, ApiHeaderGsPost, MapListInterceptor } from 'src/decorators';
import { BalanceChange } from './balance-change.schema';
import { BalanceChangeService } from './balance-change.service';
import {
  BalanceChangesResponse,
  ListBalanceChangesResponse,
  ListUserInGameBalanceChangeHistoryQuery,
  ListUserTransactionHistoryQuery,
  SubmitBalanceChangeRequest,
  SubmitBalanceChangeResponse,
} from './dto';

@ApiTags('Game Server')
@Controller('game-server')
export class GsBalanceChangeController {
  constructor(readonly balanceChangeService: BalanceChangeService) {}

  @Get('addresses/:address/transactions')
  @ApiOperation({
    operationId: 'gsGetTransactionHistoryByAddress',
    description: "GS retrieve a particular address' deposits & withdraw history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  @ApiHeaderGsGet()
  gsGetTransactionHistoryByAddress(
    @Param('address') userAddress: string,
    @Query() query: ListUserTransactionHistoryQuery,
  ) {
    return this.balanceChangeService.listTransactionHistory({ userAddress, ...query });
  }

  @Get('addresses/:address/in-game-balances-changes')
  @ApiOperation({
    operationId: 'gsGetInGameBalanceChangeHistoryByAddress',
    description: "Retrieve a particular address' in-game balance changes history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  @ApiHeaderGsGet()
  @UseInterceptors(MapListInterceptor(BalanceChangesResponse, BalanceChange))
  gsGetInGameBalanceChangeHistoryByAddress(
    @Param('address') userAddress: string,
    @Query() query: ListUserInGameBalanceChangeHistoryQuery,
  ) {
    return this.balanceChangeService.listInGameBcHistory({ userAddress, ...query });
  }

  @Post('balances-changes')
  @ApiOperation({
    operationId: 'gsSubmitBalanceChanges',
    description:
      'Submit the balance changes (can be multiple addresses at the same time). The changes will be atomic (all succeeded or all failed)',
  })
  @ApiHeaderGsPost()
  @ApiOkResponse({
    type: SubmitBalanceChangeResponse,
  })
  @UseInterceptors(MapListInterceptor(BalanceChangesResponse, BalanceChange))
  submitBalanceChanges(@Body() dto: SubmitBalanceChangeRequest) {
    return this.balanceChangeService.submitBalanceChanges(dto);
  }
}
