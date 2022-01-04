import { cpus } from 'os';

export enum UserRole {
  Admin = 'admin',
  Player = 'player',
}

export enum TreasuryEventName {
  // FROM TREASURY
  DepositEvent = 'DepositEvent',
  WithdrawEvent = 'WithdrawEvent',
  NftRegisterEvent = 'NftRegisterEvent',
  NftTransferEvent = 'NftTransferEvent',

  // INTERNAL, NOT FROM TREASURY
  // used to send notify to game server
  AdminGrantTokenEvent = 'AdminGrantTokenEvent',
  AdminDeductTokenEvent = 'AdminDeductTokenEvent',
}

export const GameServerUrlRedisKey = {
  Webhook: 'gameServer:url:webhook',
  GetItemUrl: 'gameServer:url:itemUrl',
};

export const QueueName = {
  DepositEventHandler: 'deposit-event-handler',
  GameServerNotify: 'gs-notify',
  CancelWithdrawTransaction: 'cancel-withdraw-transaction',
};

export const NUMBER_CORE_CPUS = cpus().length;

export const TimeToHours = {
  Last24Hours: 24,
  SevenDaysAgo: 7 * 24,
  Last30Days: 30 * 24,
};
