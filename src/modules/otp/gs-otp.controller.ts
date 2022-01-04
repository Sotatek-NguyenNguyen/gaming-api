import { MapInterceptor } from '@automapper/nestjs';
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsGet } from 'src/decorators';
import { GsAuthorize } from 'src/decorators/gs-authorize.decorator';
import { Otp } from './otp.schema';
import { OtpService } from './otp.service';

@ApiTags('admin')
@Controller('admin')
@GsAuthorize()
export class GsOtpController {
  constructor(readonly otpService: OtpService) {}

  @Post('otp')
  @ApiOperation({
    operationId: 'Validate OTP from game server',
    description: 'validate OTP send by player from game server and maping account ingame with wallet address',
  })
  @ApiOkResponse({})
  @ApiHeaderGsGet()
  //   @UseInterceptors(MapInterceptor(UserResponse, User))
  gsValidateAccountInGamewwithOtp(@Body() dto: any) {
    return this.otpService.validateOtp(dto);
  }
}
