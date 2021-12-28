import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { Authorize } from 'src/decorators';
import { GameBalanceResponse } from './dto';
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
}
