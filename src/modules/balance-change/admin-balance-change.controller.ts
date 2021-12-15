import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators';
import { BalanceChangeService } from './balance-change.service';
import { ListBalanceChangesResponse, ListInGameBalanceChangeHistoryQuery, ListTransactionHistoryQuery } from './dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminBalanceChangeController {
  constructor(readonly balanceChangeService: BalanceChangeService) {}

  @Get('/users/transactions')
  @Authorize()
  @ApiOperation({
    operationId: 'getTransactions',
    description: 'Get Deposit & Withdrawn History',
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  getTransactions(@Query() query: ListTransactionHistoryQuery) {
    return query;
  }

  @Get('/users/in-game-balances-changes')
  @Authorize()
  @ApiOperation({
    operationId: 'getInGameBalanceChangeHistory',
    description: 'Get in-game balance change history',
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  getCurrentUserBalancesChanges(@Query() query: ListInGameBalanceChangeHistoryQuery) {
    return query;
  }
}
