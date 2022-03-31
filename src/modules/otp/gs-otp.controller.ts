import { MapInterceptor } from '@automapper/nestjs';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsPost } from 'src/decorators';
import { GsAuthorize } from 'src/decorators/gs-authorize.decorator';
import { UserResponse } from '../user/dto';
import { User } from '../user/user.schema';
import { OtpRequest } from './dto/otp.request.dto';
import { OtpService } from './otp.service';

@ApiTags('Game Server')
@Controller('game-server')
@GsAuthorize()
export class GsOtpController {
  constructor(readonly otpService: OtpService) {}

  @Post('otp')
  @ApiOperation({
    operationId: 'Validate OTP from game server',
    description: 'validate OTP send by player from game server and maping account ingame with wallet address',
  })
  @ApiOkResponse({
    type: UserResponse,
  })
  @ApiHeaderGsPost()
  @UseInterceptors(MapInterceptor(UserResponse, User))
  gsValidateAccountInGamewwithOtp(@Body() dto: OtpRequest) {
    return this.otpService.validateOtp(dto);
  }
}
