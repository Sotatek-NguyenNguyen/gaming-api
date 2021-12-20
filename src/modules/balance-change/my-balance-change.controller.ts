import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser, MapListInterceptor } from 'src/decorators';
import { BalanceChange } from './balance-change.schema';
import { BalanceChangeService } from './balance-change.service';
import {
  BalanceChangesResponse,
  ListBalanceChangesResponse,
  ListUserInGameBalanceChangeHistoryQuery,
  ListUserTransactionHistoryQuery,
} from './dto';

@ApiTags('User')
@Controller('my')
@Authorize()
export class MyBalanceChangeController {
  constructor(readonly balanceChangeService: BalanceChangeService) {}

  @Get('transactions')
  @ApiOperation({
    operationId: 'getCurrentUserTransactionHistory',
    description: "Get current user's deposit & withdraw history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  @UseInterceptors(MapListInterceptor(BalanceChangesResponse, BalanceChange))
  getCurrentUserTransactionHistory(
    @Query() query: ListUserTransactionHistoryQuery,
    @GetUser('address') userAddress: string,
  ) {
    return this.balanceChangeService.listTransactionHistory({ userAddress, ...query });
  }

  @Get('in-game-balances-changes')
  @ApiOperation({
    operationId: 'getCurrentUserInGameBalanceChangeHistory',
    description: "Get current user's in-game balance change history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  @UseInterceptors(MapListInterceptor(BalanceChangesResponse, BalanceChange))
  getCurrentUserInGameBCHistory(
    @Query() query: ListUserInGameBalanceChangeHistoryQuery,
    @GetUser('address') userAddress: string,
  ) {
    return this.balanceChangeService.listInGameBcHistory({ userAddress, ...query });
  }
}
