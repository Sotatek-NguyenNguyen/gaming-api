import { cpus } from 'os';

export enum UserRole {
  Admin = 'admin',
  Player = 'player',
}

export enum TreasuryEventName {
  DepositEvent = 'DepositEvent',
  WithdrawEvent = 'WithdrawEvent',
}

export const QueueName = {
  DepositEventHandler: 'deposit-event-handler',
  GameServerNotify: 'gs-notify',
};

export const NUMBER_CORE_CPUS = cpus().length;
