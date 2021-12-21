import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser } from 'src/decorators';
import { User } from '../user/user.schema';
import { ListCurrentUserNftQuery, ListNftResponse, MintNftItemRequest } from './dto';
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
  getMyNftItem(@Query() query: ListCurrentUserNftQuery, @GetUser() user: User) {
    return this.nftItemService.getNftDataWithUserAddress(query, user.address);
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
