import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';
import { ArweaveMetadata } from './arweave-metadata.dto';

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

  @ApiProperty({ type: ArweaveMetadata })
  metadata: ArweaveMetadata;
}

export class MintNftItemRequest {
  @ApiProperty()
  arweaveUploadTxId: string;

  @ApiProperty()
  nftItemId: string;
}

export class MintNftItemResponse {
  @ApiProperty()
  serializedTx: string;
}
