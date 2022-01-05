import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { ChangeStream } from 'mongodb';
import { Model } from 'mongoose';
import { QueueName, TreasuryEventName } from 'src/common/constant';
import { GsNftTransferNotifyData, GsNotifyConsumerPayload } from '../treasury-event-consumer/interfaces';
import { NftItem, NftItemDocument } from './nft-item.schema';

interface ChangeStreamData {
  _id: any;
  fullDocument: NftItem;
}

@Injectable()
export class NftItemOwnerChangeStreamService implements OnModuleInit, OnModuleDestroy {
  private changeStream: ChangeStream;

  constructor(
    @InjectModel(NftItem.name) readonly model: Model<NftItemDocument>,
    @InjectQueue(QueueName.GameServerNotify)
    readonly gsNotifyQueue: Queue<GsNotifyConsumerPayload<GsNftTransferNotifyData>>,
  ) {}

  onModuleInit() {
    // TODO enhance by using options startAfter (https://docs.mongodb.com/upcoming/changeStreams/#startafter-for-change-streams)
    this.model
      .watch(
        [
          {
            $match: {
              operationType: 'update',
              'updateDescription.updatedFields.userAddress': { $exists: true },
            },
          },
        ],
        { fullDocument: 'updateLookup' },
      )
      .on('change', ({ fullDocument: nftItem }: ChangeStreamData) => {
        this.gsNotifyQueue.add({
          event: TreasuryEventName.NftTransferEvent,
          data: {
            gameItemId: nftItem.gameItemId,
            nftAddress: nftItem.address,
            ownerAddress: nftItem.userAddress,
          },
        });
      });
  }

  async onModuleDestroy() {
    this.changeStream && !this.changeStream.closed && (await this.changeStream?.close());
  }
}
