import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { QueueName } from 'src/common/constant';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { NftItemModule } from '../nft-item/nft-item.module';
import { UserModule } from '../user/user.module';
import { DepositTreasuryHandlerConsumer } from './deposit-event-handler.consumer';
import { GameServerNotifyConsumer } from './gs-notify.consumer';
import { NftRegisterHandlerConsumer } from './nft-register-event-handler.consumer';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BalanceChangeModule),
    forwardRef(() => NftItemModule),
    BullModule.registerQueue(
      {
        name: QueueName.DepositEventHandler,
      },
      {
        name: QueueName.GameServerNotify,
      },
      { name: QueueName.NftRegisterEventHandler },
    ),
  ],
  providers: [DepositTreasuryHandlerConsumer, GameServerNotifyConsumer, NftRegisterHandlerConsumer],
})
export class TreasuryEventConsumerModule {}
