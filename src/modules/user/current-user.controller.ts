import { MapInterceptor } from '@automapper/nestjs';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser } from 'src/decorators';
import { UserResponse, WithdrawRequest, WithdrawResponse } from './dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('my')
@Authorize()
export class MyBalanceController {
  constructor(readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    operationId: 'getCurrentUserInfo',
    description: "Get current user's info",
  })
  @ApiOkResponse({
    type: UserResponse,
  })
  @UseInterceptors(MapInterceptor(UserResponse, User))
  getCurrentUserInfo(@GetUser('address') address: string) {
    return this.userService.getUserByAddress(address);
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
