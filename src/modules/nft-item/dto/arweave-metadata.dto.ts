import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Attribute {
  @ApiProperty()
  trait_type: string;

  @ApiProperty()
  value: string;
}

export class ArweaveMetadata {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  image: string;

  properties: {
    files: [
      {
        uri: string;
        type: string;
      },
    ];
    category: 'image';
    creators: [
      {
        address: string;
        share: number;
      },
    ];
  };

  @ApiProperty()
  description?: string;

  seller_fee_basis_points?: number;

  @ApiProperty({ type: [Attribute] })
  attributes?: Attribute[];

  collection?: Record<string, any>;
}

export class ArweaveMetadataResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  gameItemId: string;

  @ApiProperty()
  image: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: [Attribute] })
  attributes?: Attribute[];
}
