import { TreasuryEventName } from 'src/common/constant';

export interface IGsNotifyConsumerPayload<T = IGsDepositNotifyData> {
  event: TreasuryEventName;

  data: T;
}

interface IGsDepositNotifyData {
  userAddress: string;

  amount: string;
}

export interface IGsMintNftNotifyData {
  userAddress: string;

  nftAddress: string;

  referenceId: string;
}

export interface IGsMintTransferNotifyData {
  userAddress: string;

  nftAddress: string;
}
