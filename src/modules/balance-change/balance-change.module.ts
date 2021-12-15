import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminBalanceChangeController } from './admin-balance-change.controller';
import { BalanceChange, BalanceChangeSchema } from './balance-change.schema';
import { BalanceChangeService } from './balance-change.service';
import { GsBalanceChangeController } from './gs-balance-change.controller';
import { MyBalanceChangeController } from './my-balance-change.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: BalanceChange.name, schema: BalanceChangeSchema }])],
  providers: [BalanceChangeService],
  controllers: [MyBalanceChangeController, AdminBalanceChangeController, GsBalanceChangeController],
  exports: [BalanceChangeService],
})
export class BalanceChangeModule {}
