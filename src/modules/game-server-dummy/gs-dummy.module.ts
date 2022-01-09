import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { OtpModule } from '../otp/otp.module';
import { GameServerDummyController } from './gs-dummy.controller';
import { GameServerDummyMapper } from './gs-dummy.mapper';
import { GameServerDummyService } from './gs-dummy.service';
import { GsEvent, GsEventSchema, GsGameItem, GsGameItemSchema, GsPlayer, GsPlayerSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GsPlayer.name, schema: GsPlayerSchema },
      { name: GsGameItem.name, schema: GsGameItemSchema },
      { name: GsEvent.name, schema: GsEventSchema },
    ]),
    forwardRef(() => OtpModule),
    forwardRef(() => BalanceChangeModule),
  ],
  providers: [GameServerDummyMapper, GameServerDummyService],
  controllers: [GameServerDummyController],
})
export class GameServerDummyModule {}
