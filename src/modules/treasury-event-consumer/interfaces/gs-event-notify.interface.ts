import { TreasuryEventName } from 'src/common/constant';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Allow } from 'class-validator';

@ApiExtraModels()
export class GsDepositWithdrawNotifyData {
  @ApiProperty()
  @Allow()
  userAddress: string;

  @ApiProperty()
  @Allow()
  amount: string;
}

@ApiExtraModels()
export class GsMintNftNotifyData {
  @ApiProperty()
  @Allow()
  userAddress: string;

  @ApiProperty()
  @Allow()
  nftAddress: string;

  @ApiProperty()
  @Allow()
  gameItemId: string;
}

@ApiExtraModels()
export class GsNftTransferNotifyData {
  @ApiProperty()
  @Allow()
  ownerAddress: string;

  @ApiProperty()
  @Allow()
  nftAddress: string;

  @ApiProperty()
  @Allow()
  gameItemId: string;
}

@ApiExtraModels()
export class GsAdminGrantDeductNotifyData {
  @ApiProperty()
  @Allow()
  userAddress: string;

  @ApiProperty()
  @Allow()
  amount: string;
}

@ApiExtraModels(GsDepositWithdrawNotifyData, GsMintNftNotifyData, GsNftTransferNotifyData, GsAdminGrantDeductNotifyData)
export class GsNotifyConsumerPayload<T = GsDepositWithdrawNotifyData> {
  @ApiProperty({ enum: TreasuryEventName })
  @Allow()
  event: TreasuryEventName;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(GsDepositWithdrawNotifyData) },
      { $ref: getSchemaPath(GsMintNftNotifyData) },
      { $ref: getSchemaPath(GsNftTransferNotifyData) },
      { $ref: getSchemaPath(GsAdminGrantDeductNotifyData) },
    ],
  })
  @Allow()
  data: T;
}
