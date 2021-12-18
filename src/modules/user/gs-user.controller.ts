import { MapInterceptor } from '@automapper/nestjs';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GsAuthorize } from 'src/decorators/gs-authorize.decorator';
import { UserResponse } from './dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@ApiTags('Game Server')
@Controller('game-server')
@GsAuthorize()
export class GsBalanceController {
  constructor(readonly userService: UserService) {}

  @Get('addresses/:address/balance')
  @ApiOperation({
    operationId: 'gsGetAddressBalance',
    description: "Retrieve a particular address' current balance",
  })
  @ApiOkResponse({
    type: UserResponse,
  })
  @UseInterceptors(MapInterceptor(UserResponse, User))
  gsGetAddressBalance(@Param('address') address: string) {
    return this.userService.getUserByAddress(address);
  }
}
