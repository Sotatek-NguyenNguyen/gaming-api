import { TreasuryEventName } from 'src/common/constant';

export interface ITreasuryDepositEventConsumerPayload {
  amount: string;

  userAddress: string;

  evtName: TreasuryEventName;

  transactionId: string;

  nftId?: string;

  senderAddress?: string;

  withdrawalId?: string;
}
