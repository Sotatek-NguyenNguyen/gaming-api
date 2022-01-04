import { MapInterceptor } from '@automapper/nestjs';
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsGet } from 'src/decorators';
import { GsAuthorize } from 'src/decorators/gs-authorize.decorator';
import { UserResponse } from '../user/dto';
import { Otp } from './otp.schema';
import { OtpService } from './otp.service';

@ApiTags('Game Server')
@Controller('game-server/otp')
@GsAuthorize()
export class GsOtpController {
  constructor(readonly otpService: OtpService) {}

  @Post(':address')
  @ApiOperation({
    operationId: 'Validate OTP from game server',
    description: 'validate OTP send by player from game server and maping account ingame with wallet address',
  })
  @ApiOkResponse({
    type: UserResponse,
  })
  @ApiHeaderGsGet()
  //   @UseInterceptors(MapInterceptor(UserResponse, User))
  gsValidateAccountInGamewwithOtp(@Param('address') address: string, @Body() dto: any) {
    return this.otpService.validateOtp(address, dto);
  }
}
