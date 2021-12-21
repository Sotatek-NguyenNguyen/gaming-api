import { NftItemResponse } from './dto/nft-item.response.dto';
import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser, MapListInterceptor } from 'src/decorators';
import { User } from '../user/user.schema';
import { ListCurrentUserNftQuery, ListNftResponse, MintNftItemRequest } from './dto';
import { NftItem } from './nft-item.schema';
import { NftItemService } from './nft-item.service';

@ApiTags('User')
@Controller('my/nft')
export class MyNftItemController {
  constructor(readonly nftItemService: NftItemService) {}

  @Get()
  @Authorize()
  @ApiOperation({
    operationId: 'getCurrentUserNftItems',
    description: "Get current user's nft items",
  })
  @ApiOkResponse({
    type: ListNftResponse,
  })
  @UseInterceptors(MapListInterceptor(NftItemResponse, NftItem))
  getMyNftItem(@Query() query: ListCurrentUserNftQuery, @GetUser() user: User) {
    const userAddress = user.address;
    return this.nftItemService.getNftData({ userAddress, ...query });
  }

  @Post('/mint')
  @Authorize()
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
