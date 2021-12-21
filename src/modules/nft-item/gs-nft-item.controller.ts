import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsGet, MapListInterceptor } from 'src/decorators';
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
  @ApiHeaderGsGet()
  @UseInterceptors(MapListInterceptor(NftItemResponse, NftItem))
  gsGetNftByAddress(@Param('address') address: string) {
    return this.nftItemService.getNftDataWithNFTAddress(address);
  }
}
