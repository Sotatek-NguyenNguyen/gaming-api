import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  GenerateAuthTokenTestingRequest,
  GetSignatureMsgToLoginRequest,
  GetSignatureMsgToLoginResponse,
  LoginRequest,
  LoginResponse,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('signature-msg')
  @ApiOperation({ operationId: 'getSignatureMessageToLogin', description: 'Get signature message to login' })
  @ApiOkResponse({ type: GetSignatureMsgToLoginResponse })
  getSignatureMessageToLogin(@Body() dto: GetSignatureMsgToLoginRequest) {
    return this.authService.getSignatureMessageToLogin(dto);
  }

  @Post('login')
  @ApiOperation({
    operationId: 'userLogin',
  })
  @ApiOkResponse({ type: LoginResponse })
  login(@Body() dto: LoginRequest) {
    return this.authService.userLogin(dto);
  }

  @Post('/admin/login')
  @ApiOperation({
    operationId: 'adminLogin',
  })
  @ApiOkResponse({ type: LoginResponse })
  adminLogin(@Body() dto: LoginRequest) {
    return this.authService.adminLogin(dto);
  }

  @Get('/generate-token')
  @ApiExcludeEndpoint()
  generateAuthTokenTesting(@Body() dto: GenerateAuthTokenTestingRequest) {
    if (process.env.NODE_ENV !== 'production') return this.authService.generateAuthToken(dto);
  }
}
