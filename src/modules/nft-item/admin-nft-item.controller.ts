import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { Authorize, MapListInterceptor } from 'src/decorators';
import { ListNftQuery, ListNftResponse } from './dto';
import { NftItemResponse } from './dto/nft-item.response.dto';
import { NftItemStatus } from './enum';
import { NftItem } from './nft-item.schema';
import { NftItemService } from './nft-item.service';

@ApiTags('Admin')
@Controller('admin')
@Authorize(UserRole.Admin)
export class AdminNftItemController {
  constructor(readonly nftItemService: NftItemService) {}

  @Get('users/nft')
  @ApiOperation({
    operationId: 'adminGetNftItems',
    description: 'Admin get nft items',
  })
  @ApiOkResponse({
    type: ListNftResponse,
  })
  @UseInterceptors(MapListInterceptor(NftItemResponse, NftItem))
  getNftItemByUserId(@Query() query: ListNftQuery) {
    return this.nftItemService.list({ ...query, status: NftItemStatus.Minted });
  }
}
