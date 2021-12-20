import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GsRequestHistoryModule } from '../gs-request-history/gs-request-history.module';
import { UserModule } from '../user/user.module';
import { AdminBalanceChangeController } from './admin-balance-change.controller';
import { BalanceChangeMapper } from './balance-change.mapper';
import { BalanceChange, BalanceChangeSchema } from './balance-change.schema';
import { BalanceChangeService } from './balance-change.service';
import { GsBalanceChangeController } from './gs-balance-change.controller';
import { MyBalanceChangeController } from './my-balance-change.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BalanceChange.name, schema: BalanceChangeSchema }]),
    forwardRef(() => GsRequestHistoryModule),
    forwardRef(() => UserModule),
  ],
  providers: [BalanceChangeService, BalanceChangeMapper],
  controllers: [MyBalanceChangeController, AdminBalanceChangeController, GsBalanceChangeController],
})
export class BalanceChangeModule {}
