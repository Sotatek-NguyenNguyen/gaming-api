import { InjectQueue, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { NUMBER_CORE_CPUS, QueueName } from 'src/common/constant';
import { NftRegisterService } from '../nft-item/nft-register.service';
import { GsMintNftNotifyData, GsNotifyConsumerPayload, ITreasuryDepositEventConsumerPayload } from './interfaces';

@Processor(QueueName.NftRegisterEventHandler)
export class NftRegisterHandlerConsumer {
  constructor(
    @InjectQueue(QueueName.GameServerNotify)
    readonly gsNotifyQueue: Queue<GsNotifyConsumerPayload<GsMintNftNotifyData>>,
    readonly nftItemRegisterService: NftRegisterService,
  ) {}

  @Process({
    concurrency: NUMBER_CORE_CPUS,
  })
  async transcode({ data }: Job<ITreasuryDepositEventConsumerPayload>) {
    if (!data.nftId) throw new Error('NFT_ID_IS_NULL');

    const nftItem = await this.nftItemRegisterService.handleNftRegisterEvent(data);

    if (nftItem)
      await this.gsNotifyQueue.add(
        {
          event: data.evtName,
          data: {
            userAddress: data.userAddress,
            gameItemId: nftItem.gameItemId,
            nftAddress: nftItem.address,
          },
        },
        { attempts: 5, backoff: 1000 * 60 },
      );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.info(`Completed job ${job.id} of type ${job.name} with result ${JSON.stringify(job.returnvalue)}`);
  }

  @OnQueueFailed()
  onFailed(job: any) {
    console.error(`Failed job ${job.id} of type ${job.name} with failed reason: ${job.failedReason}`);
  }

  @OnQueueError()
  onError(job: any) {
    console.error(`Errored job ${job.id} of type ${job.name} with failed reason: ${job.failedReason}`);
  }
}
