import excel from 'node-excel-export';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { SuccessResponseDto } from 'src/common/dto';
import { Authorize } from 'src/decorators';
import { AdminGrantTokenRequest, ListUserQuery, ListUserResponse } from './dto';
import { UserService } from './user.service';

@ApiTags('Admin')
@Controller('admin/users')
@Authorize(UserRole.Admin)
export class AdminUserController {
  constructor(readonly userService: UserService) {}

  @Get('excel')
  @ApiOperation({
    operationId: 'adminGetUsersToExcel',
    description: 'Admin get list user and export to Excel',
  })
  @ApiOkResponse({})
  listUserToExcel(@Res() res) {
    return this.userService.listUserToExcel(res);
  }

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

  @Post('grant-token')
  @ApiOperation({
    operationId: 'adminGrantTokenUser',
    description: "Allows admin to top-up user's balance",
  })
  @ApiOkResponse({ type: SuccessResponseDto })
  adminGrantTokenUser(@Body() dto: AdminGrantTokenRequest) {
    return this.userService.adminGrantToken(dto);
  }

  @Post('deduct-token')
  @ApiOperation({
    operationId: 'adminDeductTokenUser',
    description: "Allows admin to deduct user's balance",
  })
  @ApiOkResponse({ type: SuccessResponseDto })
  adminDeductTokenUser(@Body() dto: AdminGrantTokenRequest) {
    return this.userService.adminDeductToken(dto);
  }
}
