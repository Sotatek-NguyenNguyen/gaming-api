import { cpus } from 'os';

export enum UserRole {
  Admin = 'admin',
  Player = 'player',
}

export enum TreasuryEventName {
  DepositEvent = 'DepositEvent',
  WithdrawEvent = 'WithdrawEvent',
  NftRegisterEvent = 'NftRegisterEvent',
  NftTransferEvent = 'NftTransferEvent',
}

export const GameServerUrlRedisKey = {
  Webhook: 'gameServer:url:webhook',
  GetItemUrl: 'gameServer:url:itemUrl',
};

export const QueueName = {
  DepositEventHandler: 'deposit-event-handler',
  GameServerNotify: 'gs-notify',
};

export const NUMBER_CORE_CPUS = cpus().length;

export const TimeToHours = {
  Last24Hours: 24,
  OneDayAgo: 48,
  SevenDaysAgo: 7 * 24,
};
