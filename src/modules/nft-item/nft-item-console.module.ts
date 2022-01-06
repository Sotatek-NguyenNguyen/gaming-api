import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueName } from 'src/common/constant';
import { NftItemOwnerChangeStreamService } from './nft-item-owner-change-stream.service';
import { NftItemConsole } from './nft-item.console';
import { NftItem, NftItemSchema } from './nft-item.schema';
import { NftItemService } from './nft-item.service';
import { NftMapper } from './nft.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NftItem.name, schema: NftItemSchema }]),
    BullModule.registerQueue({
      name: QueueName.GameServerNotify,
    }),
  ],
  providers: [NftItemService, NftMapper, NftItemConsole, NftItemOwnerChangeStreamService],
})
export class NftItemConsoleModule {}
