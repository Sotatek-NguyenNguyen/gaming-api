import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BalanceChangeService } from './balance-change.service';
import {
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
  gsGetDepositsHistoryByAddress(@Param('address') address: string, @Query() query: ListUserTransactionHistoryQuery) {
    return query;
  }

  @Get('addresses/:address/in-game-balances-changes')
  @ApiOperation({
    operationId: 'gsGetInGameBalanceChangeHistoryByAddress',
    description: "Retrieve a particular address' in-game balance changes history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  gsGetInGameBalanceChangeHistoryByAddress(
    @Param('address') address: string,
    @Query() query: ListUserInGameBalanceChangeHistoryQuery,
  ) {
    return query;
  }

  @Post('balances-changes')
  @ApiOperation({
    operationId: 'gsSubmitBalanceChanges',
    description:
      'Submit the balance changes (can be multiple addresses at the same time). The changes will be atomic (all succeeded or all failed)',
  })
  @ApiOkResponse({
    type: SubmitBalanceChangeResponse,
  })
  submitBalanceChanges(@Body() dto: SubmitBalanceChangeRequest) {
    return dto;
  }
}
