import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators';
import { ListNftQuery, ListNftResponse } from './dto';
import { NftItemService } from './nft-item.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminNftItemController {
  constructor(readonly nftItemService: NftItemService) {}

  @Get('users/nft')
  @Authorize()
  @ApiOperation({
    operationId: 'adminGetNftItems',
    description: 'Admin get nft items',
  })
  @ApiOkResponse({
    type: ListNftResponse,
  })
  getNftItemByUserId(@Query() query: ListNftQuery) {
    return query;
  }
}
