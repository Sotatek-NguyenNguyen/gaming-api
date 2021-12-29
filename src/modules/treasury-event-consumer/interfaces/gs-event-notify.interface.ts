import { TreasuryEventName } from 'src/common/constant';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

@ApiExtraModels()
export class GsDepositWithdrawNotifyData {
  @ApiProperty()
  userAddress: string;

  @ApiProperty()
  amount: string;
}

@ApiExtraModels()
export class GsMintNftNotifyData {
  @ApiProperty()
  userAddress: string;

  @ApiProperty()
  nftAddress: string;

  @ApiProperty()
  gameItemId: string;
}

@ApiExtraModels()
export class GsNftTransferNotifyData {
  @ApiProperty()
  fromUserAddress: string;

  @ApiProperty()
  toUserAddress: string;

  @ApiProperty()
  nftAddress: string;

  @ApiProperty()
  gameItemId: string;
}

@ApiExtraModels(GsDepositWithdrawNotifyData, GsMintNftNotifyData, GsNftTransferNotifyData)
export class GsNotifyConsumerPayload<T = GsDepositWithdrawNotifyData> {
  @ApiProperty({ enum: TreasuryEventName })
  event: TreasuryEventName;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(GsDepositWithdrawNotifyData) },
      { $ref: getSchemaPath(GsMintNftNotifyData) },
      { $ref: getSchemaPath(GsNftTransferNotifyData) },
    ],
  })
  data: T;
}
