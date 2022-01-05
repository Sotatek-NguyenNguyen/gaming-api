export enum BalanceChangeType {
  Deposit = 'deposit',
  Withdrawn = 'withdrawn',
  AdminDeposit = 'admin_deposit',
  AdminWithdraw = 'admin_withdraw',
  AdminGrant = 'admin_grant',
  AdminDeduct = 'admin_deduct',
  InGameIncrease = 'in_game_increase',
  InGameDecrease = 'in_game_decrease',
}

export enum BalanceChangeStatus {
  Succeed = 'succeed',
  Failed = 'failed',
  Pending = 'pending',
}
