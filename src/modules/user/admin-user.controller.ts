import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { Authorize } from 'src/decorators';
import { ListUserQuery, ListUserResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('Admin')
@Controller('admin/users')
@Authorize(UserRole.Admin)
export class AdminUserController {
  constructor(readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    operationId: 'adminGetUsers',
    description: 'Admin get list user',
  })
  @ApiOkResponse({
    type: ListUserResponse,
  })
  listUser(@Query() query: ListUserQuery) {
    return this.userService.list(query);
  }
}
