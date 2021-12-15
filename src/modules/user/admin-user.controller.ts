import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators';
import { ListUserQuery, ListUserResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('Admin')
@Controller('admin/users')
export class AdminUserController {
  constructor(readonly userService: UserService) {}

  @Get()
  @Authorize()
  @ApiOperation({
    operationId: 'adminGetUsers',
    description: 'Admin get list user',
  })
  @ApiOkResponse({
    type: ListUserResponse,
  })
  listUser(@Query() query: ListUserQuery) {
    return query;
  }
}
