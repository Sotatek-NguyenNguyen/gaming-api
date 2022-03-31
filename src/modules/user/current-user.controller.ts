import { MapInterceptor } from '@automapper/nestjs';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser } from 'src/decorators';
import {
  UserResponse,
  UserWithdrawRequest,
  UserWithdrawResponse,
  UserOTPRequest,
  UserOTPResponse,
  UserLoginRequest,
  UserLoginResponse,
} from './dto';
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
  @ApiOperation({
    operationId: 'requestWithdraw',
    description: 'Request to perform a withdrawal',
  })
  @ApiOkResponse({ type: UserWithdrawResponse })
  withdraw(@Body() dto: UserWithdrawRequest, @GetUser('address') userAddress: string) {
    return this.userService.userWithdraw(userAddress, dto);
  }

  @Post('requestotp')
  @ApiOperation({
    operationId: 'request otp',
    description: 'Request to game server - push otp to email',
  })
  @ApiOkResponse({ type: UserOTPResponse })
  getOtp(@Body() dto: UserOTPRequest) {
    return this.userService.userRequestOTP(dto);
  }

  @Post('login')
  @ApiOperation({
    operationId: 'request login',
    description: 'Request to game server - confirm login connect address and email',
  })
  @ApiOkResponse({ type: UserLoginResponse })
  login(@Body() dto: UserLoginRequest, @GetUser('address') userAddress: string) {
    return this.userService.userLogin(dto, userAddress);
  }
}
