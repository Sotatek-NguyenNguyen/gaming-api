import { InjectQueue, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { NUMBER_CORE_CPUS, QueueName } from 'src/common/constant';
import { BalanceChangeService } from '../balance-change/balance-change.service';
import { GsNotifyConsumerPayload, ITreasuryDepositEventConsumerPayload } from './interfaces';

@Processor(QueueName.DepositEventHandler)
export class DepositTreasuryHandlerConsumer {
  constructor(
    @InjectQueue(QueueName.GameServerNotify) readonly gsNotifyQueue: Queue<GsNotifyConsumerPayload>,
    readonly balanceChangeService: BalanceChangeService,
  ) {}

  @Process({
    concurrency: NUMBER_CORE_CPUS,
  })
  async transcode({ data }: Job<ITreasuryDepositEventConsumerPayload>) {
    await this.balanceChangeService.handleTreasuryDepositEvent(data);

    await this.gsNotifyQueue.add(
      {
        event: data.evtName,
        data: {
          userAddress: data.userAddress,
          amount: data.amount,
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
