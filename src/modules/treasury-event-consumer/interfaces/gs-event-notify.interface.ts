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
  ownerAddress: string;

  @ApiProperty()
  nftAddress: string;

  @ApiProperty()
  gameItemId: string;
}

@ApiExtraModels()
export class GsAdminGrantDeductNotifyData {
  @ApiProperty()
  userAddress: string;

  @ApiProperty()
  amount: string;
}

@ApiExtraModels(GsDepositWithdrawNotifyData, GsMintNftNotifyData, GsNftTransferNotifyData, GsAdminGrantDeductNotifyData)
export class GsNotifyConsumerPayload<T = GsDepositWithdrawNotifyData> {
  @ApiProperty({ enum: TreasuryEventName })
  event: TreasuryEventName;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(GsDepositWithdrawNotifyData) },
      { $ref: getSchemaPath(GsMintNftNotifyData) },
      { $ref: getSchemaPath(GsNftTransferNotifyData) },
      { $ref: getSchemaPath(GsAdminGrantDeductNotifyData) },
    ],
  })
  data: T;
}
