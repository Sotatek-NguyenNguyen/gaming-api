import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { QueueName } from 'src/common/constant';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { UserModule } from '../user/user.module';
import { DepositTreasuryHandlerConsumer } from './deposit-event-handler.consumer';
import { GameServerNotifyConsumer } from './gs-notify.consumer';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BalanceChangeModule),
    BullModule.registerQueue(
      {
        name: QueueName.DepositEventHandler,
      },
      {
        name: QueueName.GameServerNotify,
      },
    ),
  ],
  providers: [DepositTreasuryHandlerConsumer, GameServerNotifyConsumer],
})
export class TreasuryEventConsumerModule {}
