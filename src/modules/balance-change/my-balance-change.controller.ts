import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators';
import { BalanceChangeService } from './balance-change.service';
import {
  ListBalanceChangesResponse,
  ListUserInGameBalanceChangeHistoryQuery,
  ListUserTransactionHistoryQuery,
} from './dto';

@ApiTags('User')
@Controller('my')
export class MyBalanceChangeController {
  constructor(readonly balanceChangeService: BalanceChangeService) {}

  @Get('transactions')
  @Authorize()
  @ApiOperation({
    operationId: 'getCurrentUserTransactionHistory',
    description: "Get current user's deposit & withdraw history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  getCurrentUserDepositHistory(@Query() query: ListUserTransactionHistoryQuery) {
    return query;
  }

  @Get('in-game-balances-changes')
  @Authorize()
  @ApiOperation({
    operationId: 'getCurrentUserInGameBalanceChangeHistory',
    description: "Get current user's in-game balance change history",
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  getCurrentUserBalancesChanges(@Query() query: ListUserInGameBalanceChangeHistoryQuery) {
    return query;
  }
}
