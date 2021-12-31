import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { Authorize, MapListInterceptor } from 'src/decorators';
import { BalanceChange } from './balance-change.schema';
import { BalanceChangeService } from './balance-change.service';
import {
  AdminListUserInGameBalanceChangeHistoryQuery,
  AdminListUserTransactionHistoryQuery,
  BalanceChangesResponse,
  ListBalanceChangesResponse,
} from './dto';
import { overviewStatistic } from './dto/get-statistic-overview.response';

@ApiTags('Admin')
@Controller('admin')
@Authorize(UserRole.Admin)
export class AdminBalanceChangeController {
  constructor(readonly balanceChangeService: BalanceChangeService) {}

  @Get('/users/transactions')
  @ApiOperation({
    operationId: 'getTransactionHistory',
    description: 'Get Deposit & Withdrawn History',
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  @UseInterceptors(MapListInterceptor(BalanceChangesResponse, BalanceChange))
  getTransactionHistory(@Query() query: AdminListUserTransactionHistoryQuery) {
    return this.balanceChangeService.listTransactionHistory(query);
  }

  @Get('/users/in-game-balances-changes')
  @ApiOperation({
    operationId: 'getInGameBalanceChangeHistory',
    description: 'Get in-game balance change history',
  })
  @ApiOkResponse({
    type: ListBalanceChangesResponse,
  })
  @UseInterceptors(MapListInterceptor(BalanceChangesResponse, BalanceChange))
  getCurrentUserBalancesChanges(@Query() query: AdminListUserInGameBalanceChangeHistoryQuery) {
    return this.balanceChangeService.listInGameBcHistory(query);
  }

  @Get('/overview-statistic')
  @ApiOperation({
    operationId: 'Get dayly,weekly deposit/withdrawn statistic',
    description: 'Get dayly,weekly deposit/withdrawn statistic by admin',
  })
  @ApiOkResponse({
    type: overviewStatistic,
  })
  getOverviewStatistic() {
    return this.balanceChangeService.overviewStatistic();
  }
}
