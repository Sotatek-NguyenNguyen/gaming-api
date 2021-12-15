import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('Game Server')
@Controller('game-server')
export class GsBalanceController {
  constructor(readonly userService: UserService) {}

  @Get('addresses/:address/balance')
  @ApiOperation({
    operationId: 'gsGetAddressBalance',
    description: "Retrieve a particular address' current balance",
  })
  @ApiOkResponse({
    type: GetCurrentUserResponse,
  })
  gsGetAddressBalance(@Param('address') address: string) {
    return address;
  }
}
