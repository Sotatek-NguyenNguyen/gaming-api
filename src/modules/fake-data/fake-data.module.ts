import { forwardRef, Module } from '@nestjs/common';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { NftItemModule } from '../nft-item/nft-item.module';
import { UserModule } from '../user/user.module';
import { FakeDataController } from './fake-data.controller';
import { FakeDataService } from './fake-data.service';

@Module({
  imports: [forwardRef(() => BalanceChangeModule), forwardRef(() => NftItemModule), forwardRef(() => UserModule)],
  providers: [FakeDataService],
  controllers: [FakeDataController],
})
export class FakeDataModule {}
