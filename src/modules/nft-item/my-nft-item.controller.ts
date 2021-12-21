import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser, MapListInterceptor } from 'src/decorators';
import { ListCurrentUserNftQuery, ListNftResponse, MintNftItemRequest } from './dto';
import { NftItemResponse } from './dto/nft-item.response.dto';
import { NftItem } from './nft-item.schema';
import { NftItemService } from './nft-item.service';

@ApiTags('User')
@Authorize()
@Controller('my/nft')
export class MyNftItemController {
  constructor(readonly nftItemService: NftItemService) {}

  @Get()
  @ApiOperation({
    operationId: 'getCurrentUserNftItems',
    description: "Get current user's nft items",
  })
  @ApiOkResponse({
    type: ListNftResponse,
  })
  @UseInterceptors(MapListInterceptor(NftItemResponse, NftItem))
  getMyNftItem(@Query() query: ListCurrentUserNftQuery, @GetUser('address') userAddress: string) {
    return this.nftItemService.list({ userAddress, ...query });
  }

  @Post('/mint')
  @ApiOperation({
    operationId: 'mintNftItem',
    description: 'Request to mint NFT from an in-game item',
  })
  // @ApiOkResponse({
  //   type: ListUserDepositHistoryResponse,
  // })
  mintNftItem(@Body() dto: MintNftItemRequest) {
    return dto;
  }
}
