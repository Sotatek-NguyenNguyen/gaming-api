import { TreasuryEventName } from 'src/common/constant';

export interface ITreasuryDepositEventConsumerPayload {
  amount: string;

  userAddress: string;

  evtName: TreasuryEventName;

  transactionId: string;
}