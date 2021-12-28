import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { Authorize, GetUser } from 'src/decorators';
import { AdminWithdrawRequest, AdminWithdrawResponse, GameBalanceResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('Admin')
@Controller('admin/game-balance')
@Authorize(UserRole.Admin)
export class AdminGameBalanceController {
  constructor(readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    operationId: 'adminGetGameBalance',
  })
  @ApiOkResponse({
    type: GameBalanceResponse,
  })
  listUser() {
    return this.userService.adminGetGameBalance();
  }

  @Post('withdrawals')
  @ApiOperation({
    operationId: 'adminWithdrawnFromActualGameBalance',
  })
  @ApiOkResponse({
    type: AdminWithdrawResponse,
  })
  adminWithdraw(@Body() dto: AdminWithdrawRequest, @GetUser('address') payerAddress: string) {
    return this.userService.adminWithdraw(payerAddress, dto);
  }
}
