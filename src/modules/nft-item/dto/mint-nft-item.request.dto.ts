import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IsString } from 'src/decorators/validators';
import { ArweaveMetadataResponse } from './arweave-metadata.dto';

export class ArweaveUploadPaymentRequest {
  @ApiProperty()
  @IsString()
  gameItemId: string;
}

export class ArweaveUploadPaymentResponse {
  @ApiProperty()
  serializedTx: string;

  @ApiProperty()
  nftItemId: string;

  @ApiProperty({ type: ArweaveMetadataResponse })
  metadata: ArweaveMetadataResponse;
}

export class MintNftItemRequest {
  @ApiProperty()
  @IsString()
  arweaveUploadTxId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  nftItemId: string;
}

export class MintNftItemResponse {
  @ApiProperty()
  serializedTx: string;
}
