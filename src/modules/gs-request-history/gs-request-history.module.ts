import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { GsRequestHistory, GsRequestHistorySchema } from './gs-request-history.schema';
import { GsRequestHistoryService } from './gs-request-history.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: GsRequestHistory.name, schema: GsRequestHistorySchema }])],
  providers: [GsRequestHistoryService],
  exports: [GsRequestHistoryService],
})
export class GsRequestHistoryModule {}
