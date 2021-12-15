import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NftItemResponse } from './dto/nft-item.response.dto';
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
  gsGetNftByAddress(@Param('address') address: string) {
    return address;
  }
}
