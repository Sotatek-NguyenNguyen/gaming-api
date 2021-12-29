import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NUMBER_CORE_CPUS, QueueName } from 'src/common/constant';
import { GsHelperService } from '../shared/services';
import { GsNotifyConsumerPayload } from './interfaces';

@Processor(QueueName.GameServerNotify)
export class GameServerNotifyConsumer {
  constructor(private readonly gsHelperService: GsHelperService) {}

  @Process({
    concurrency: NUMBER_CORE_CPUS,
  })
  transcode({ data }: Job<GsNotifyConsumerPayload>) {
    return this.gsHelperService.notifyGs(data);
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
