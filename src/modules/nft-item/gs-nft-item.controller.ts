import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapListInterceptor } from 'src/decorators';
import { ListNftQuery, ListNftResponse } from './dto';
import { NftItemResponse } from './dto/nft-item.response.dto';
import { NftItem } from './nft-item.schema';
import { NftItemService } from './nft-item.service';

@ApiTags('Game Server')
@Controller('game-server/nft')
export class GsNftItemController {
  constructor(readonly nftItemService: NftItemService) {}

  @Get(':address')
  @ApiOperation({
    operationId: 'gsGetNftByAddress',
    description: 'Retrieve information of a particular NFT (to get the owner)',
  })
  @ApiOkResponse({
    type: NftItemResponse,
  })
  // @UseInterceptors(MapListInterceptor(ListNftResponse, NftItem))
  gsGetNftByAddress(@Param('address') address: string) {
    return this.nftItemService.getNftDataWithNFTAddress(address);
  }
}
