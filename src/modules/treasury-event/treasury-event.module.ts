import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueName } from 'src/common/constant';
import {
  LatestSignature,
  LatestSignatureSchema,
  Signature,
  SignatureSchema,
  TreasuryEvent,
  TreasuryEventSchema,
} from './schema';
import { TreasuryEventConsole } from './treasury-event.console';
import { TreasuryEventService } from './treasury-event.service';
import { TreasurySignatureService } from './treasury-signature.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreasuryEvent.name, schema: TreasuryEventSchema },
      { name: Signature.name, schema: SignatureSchema },
      { name: LatestSignature.name, schema: LatestSignatureSchema },
    ]),
    BullModule.registerQueue(
      {
        name: QueueName.DepositEventHandler,
      },
      { name: QueueName.NftRegisterEventHandler },
    ),
  ],
  providers: [TreasuryEventConsole, TreasuryEventService, TreasurySignatureService],
})
export class TreasuryEventModule {}
