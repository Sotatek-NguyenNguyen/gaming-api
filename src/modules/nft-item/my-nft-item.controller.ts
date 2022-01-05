import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize, GetUser, MapListInterceptor } from 'src/decorators';
import {
  ListCurrentUserNftQuery,
  ListNftResponse,
  ArweaveUploadPaymentRequest,
  ArweaveUploadPaymentResponse,
  MintNftItemRequest,
  MintNftItemResponse,
} from './dto';
import { NftItemResponse } from './dto/nft-item.response.dto';
import { NftItem } from './nft-item.schema';
import { NftItemService } from './nft-item.service';
import { NftRegisterService } from './nft-register.service';

@ApiTags('User')
@Authorize()
@Controller('my/nft')
export class MyNftItemController {
  constructor(readonly nftItemService: NftItemService, readonly nftRegisterService: NftRegisterService) {}

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

  @Post('/mint/arweave-upload')
  @ApiOperation({
    operationId: 'createTxForArweavePayment',
    description: 'First step to mint nft: Request tx arweave upload for an in-game item',
  })
  @ApiOkResponse({
    type: ArweaveUploadPaymentResponse,
  })
  createTxForArweavePayment(@Body() dto: ArweaveUploadPaymentRequest, @GetUser('address') userAddress: string) {
    return this.nftRegisterService.createTxForArweavePayment(userAddress, dto);
  }

  @Post('/mint')
  @ApiOperation({
    operationId: 'mintNftItem',
    description: 'Last step to mint nft: Request to mint NFT from an in-game item',
  })
  @ApiOkResponse({
    type: MintNftItemResponse,
  })
  treasuryMintNft(@Body() dto: MintNftItemRequest, @GetUser('address') userAddress: string) {
    return this.nftRegisterService.treasuryMintNft(userAddress, dto);
  }
}
