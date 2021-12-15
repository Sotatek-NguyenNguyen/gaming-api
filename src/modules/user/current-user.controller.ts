import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators';
import { GetCurrentUserResponse, WithdrawRequest, WithdrawResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('my')
export class MyBalanceController {
  constructor(readonly userService: UserService) {}

  @Get()
  @Authorize()
  @ApiOperation({
    operationId: 'getCurrentUserInfo',
    description: "Get current user's info",
  })
  @ApiOkResponse({
    type: GetCurrentUserResponse,
  })
  getCurrentUserInfo() {
    //
  }

  @Post('withdrawals')
  @Authorize()
  @ApiOperation({
    operationId: 'requestWithdraw',
    description: 'Request to perform a withdrawal',
  })
  @ApiOkResponse({ type: WithdrawResponse })
  withdraw(@Body() dto: WithdrawRequest) {
    return dto;
  }
}
