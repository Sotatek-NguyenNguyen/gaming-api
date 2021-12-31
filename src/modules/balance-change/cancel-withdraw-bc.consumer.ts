import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { NUMBER_CORE_CPUS, QueueName } from 'src/common/constant';
import { UserService } from '../user/user.service';
import { BalanceChangeStatus } from './balance-change.enum';
import { BalanceChange, BalanceChangeDocument } from './balance-change.schema';

@Processor(QueueName.CancelWithdrawTransaction)
export class CancelWithdrawBcConsumer {
  constructor(
    @InjectModel(BalanceChange.name) readonly model: Model<BalanceChangeDocument>,
    readonly userService: UserService,
  ) {}

  @Process({
    concurrency: NUMBER_CORE_CPUS,
  })
  async transcode({ data }: Job<BalanceChange>) {
    const session = await this.model.startSession();

    try {
      await session.withTransaction(async () => {
        await Promise.all([
          this.model.updateOne({ _id: data.id }, { status: BalanceChangeStatus.Failed }, { session }),
          this.userService.bulkUpdateUserBalanceByAddress(
            [{ address: data.userAddress, amount: data.amount }],
            session,
          ),
        ]);
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
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
