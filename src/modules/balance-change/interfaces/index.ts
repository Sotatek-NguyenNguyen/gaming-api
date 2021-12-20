import { BalanceChangeType } from '../balance-change.enum';

export interface IBalanceChangesFilter {
  userAddress?: string;

  fromDate?: Date;

  toDate?: Date;

  transactionId?: string;

  type?: BalanceChangeType;

  page: number;

  pageSize: number;
}
