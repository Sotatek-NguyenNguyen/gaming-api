import { QueueName, TimeToHours } from 'src/common/constant';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { set } from 'lodash';
import { dayjs } from 'src/common/pkg/dayjs';
import { AnyKeys, ClientSession, FilterQuery, Model, PipelineStage } from 'mongoose';
import { TreasuryEventName, UserRole } from 'src/common/constant';
import { IDataWithPagination } from 'src/common/interfaces';
import { GsRequestHistoryService } from '../gs-request-history/gs-request-history.service';
import { ApiConfigService, GsHelperService } from '../shared/services';
import { ITreasuryDepositEventConsumerPayload } from '../treasury-event-consumer/interfaces';
import { UserService } from '../user/user.service';
import { BalanceChangeStatus, BalanceChangeType } from './balance-change.enum';
import { BalanceChange, BalanceChangeDocument } from './balance-change.schema';
import { SubmitBalanceChangeRequest } from './dto';
import { IBalanceChangesFilter } from './interfaces';
import { tranformNullToStatisticData } from 'src/common/utils';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BalanceChangeService {
  constructor(
    @InjectModel(BalanceChange.name) readonly model: Model<BalanceChangeDocument>,
    readonly gsRequestHistoryService: GsRequestHistoryService,
    readonly gsHelperService: GsHelperService,
    readonly userService: UserService,
    readonly configService: ApiConfigService,
    @InjectQueue(QueueName.CancelWithdrawTransaction) readonly cancelWithdrawnQueue: Queue<BalanceChange>,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    if (!this.configService.isMasterProcess) {
      return;
    }

    let page = 1;
    const pageSize = 100;

    while (true) {
      const txs = await this.model
        .find({
          type: { $in: [BalanceChangeType.Withdrawn, BalanceChangeType.AdminWithdraw] },
          status: BalanceChangeStatus.Pending,
          createdAt: { $lte: dayjs().subtract(2, 'hour').toDate() as unknown as string },
        })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true });

      if (!txs.length) {
        return;
      }

      await this.cancelWithdrawnQueue.addBulk(
        txs.map((tx) => ({
          data: tx,
          opts: {
            attempts: 3,
            backoff: 1000,
          },
        })),
      );

      page++;
    }
  }

  async getUnallocatedGameBalance() {
    const res = await this.model.aggregate([
      {
        $match: {
          type: {
            $in: [
              BalanceChangeType.AdminDeposit,
              BalanceChangeType.AdminWithdraw,
              BalanceChangeType.AdminDeduct,
              BalanceChangeType.AdminGrant,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$type' as any,
          amount: { $sum: '$amount' },
        },
      },
    ]);

    if (!res.length) {
      return 0;
    }

    return res.reduce((total: number, { _id, amount }: { _id: BalanceChangeType; amount: number }) => {
      if ([BalanceChangeType.AdminDeposit, BalanceChangeType.AdminDeduct].includes(_id)) {
        return total + amount;
      }

      if ([BalanceChangeType.AdminWithdraw, BalanceChangeType.AdminGrant].includes(_id)) {
        return total - amount;
      }

      return total;
    }, 0);
  }

  listTransactionHistory(filter: IBalanceChangesFilter) {
    return this._list(filter, {
      type: {
        $in: [
          BalanceChangeType.Deposit,
          BalanceChangeType.Withdrawn,
          BalanceChangeType.AdminDeduct,
          BalanceChangeType.AdminGrant,
        ],
      },
    });
  }

  listInGameBcHistory(filter: IBalanceChangesFilter) {
    return this._list(filter, { type: { $in: [BalanceChangeType.InGameDecrease, BalanceChangeType.InGameIncrease] } });
  }

  async submitBalanceChanges(dto: SubmitBalanceChangeRequest) {
    const request = await this.gsRequestHistoryService.getByRequestId(dto.requestId);

    if (request) {
      return request.dataResponse;
    }

    const userBalanceMap: Record<string, number> = {};
    const addresses: Set<string> = new Set();

    dto.balanceChanges.forEach((bc) => {
      if (!userBalanceMap[bc.address]) {
        userBalanceMap[bc.address] = 0;
      }

      userBalanceMap[bc.address] += bc.amount;
      addresses.add(bc.address);
    });

    await this.userService.checkUsersExist(Array.from(addresses));

    const session = await this.model.startSession();
    try {
      await session.withTransaction(async () => {
        await Promise.all([
          this.model.insertMany(
            dto.balanceChanges.map(
              (bc) =>
                <BalanceChange>{
                  userAddress: bc.address,
                  amount: bc.amount,
                  type: bc.amount > 0 ? BalanceChangeType.InGameIncrease : BalanceChangeType.InGameDecrease,
                },
            ),
            { session },
          ),
          this.userService.bulkUpdateUserBalanceByAddress(
            Object.entries(userBalanceMap).map(([address, amount]) => ({ address, amount })),
            session,
          ),
        ]);

        return this.gsRequestHistoryService.create(
          { requestId: dto.requestId, dataResponse: { success: true }, statusResponse: 200 },
          session,
        );
      });
    } finally {
      await session.endSession();
    }

    await this.gsHelperService.saveRequestDataToRedis({
      requestId: dto.requestId,
      dataResponse: { success: true },
      statusResponse: 200,
    });

    return { success: true };
  }

  async handleTreasuryDepositEvent({
    amount,
    userAddress,
    evtName,
    transactionId,
    withdrawalId,
  }: ITreasuryDepositEventConsumerPayload) {
    const user = await this.userService.checkUserExistByAddress(userAddress);
    const isPlayer = user.role === UserRole.Player;
    let balanceChangeType = this._getBcTypeFromTreasuryEvent(evtName, isPlayer);

    console.log('==========', evtName, withdrawalId);

    if (withdrawalId) {
      const withdrawBc = await this.model
        .findOne({
          _id: withdrawalId,
          userAddress,
        })
        .lean({ virtuals: true });

      if (!withdrawBc) {
        return;
      }

      balanceChangeType = withdrawBc.type;
    }

    const session = await this.model.startSession();

    try {
      await session.withTransaction(() =>
        Promise.all([
          withdrawalId
            ? this.model.findOneAndUpdate(
                {
                  _id: withdrawalId,
                },
                {
                  $set: {
                    status: BalanceChangeStatus.Succeed,
                    transactionId,
                  },
                },
              )
            : this.model.create(
                [
                  {
                    userAddress,
                    amount,
                    transactionId,
                    type: balanceChangeType,
                  },
                ],
                { session },
              ),
          balanceChangeType === BalanceChangeType.Deposit &&
            this.userService.bulkUpdateUserBalanceByAddress(
              [
                {
                  address: userAddress,
                  amount: +amount,
                },
              ],
              session,
            ),
        ]),
      );
    } finally {
      await session.endSession();
    }

    return {
      notifyGameServer:
        isPlayer && [BalanceChangeType.Deposit, BalanceChangeType.Withdrawn].includes(balanceChangeType),
    };
  }

  async _list(
    filter: IBalanceChangesFilter,
    defaultQuery?: FilterQuery<BalanceChange>,
  ): Promise<IDataWithPagination<BalanceChange>> {
    const query = Object.assign(defaultQuery, this._genQueryFromRequestFilter(filter));
    const { page, pageSize } = filter;

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.model.count(query),
    ]);

    return { data, page, pageSize, total, totalPage: Math.ceil(total / pageSize) };
  }

  _getBcTypeFromTreasuryEvent(evtName: TreasuryEventName, isPlayer: boolean) {
    // WARNING:
    // In new logic, we dont need to check for event withdrawn
    // But for compatibility with old code of smart contract, cant delete redundant code at least for now
    if (isPlayer && evtName === TreasuryEventName.DepositEvent) {
      return BalanceChangeType.Deposit;
    }

    if (isPlayer) {
      return BalanceChangeType.Withdrawn;
    }

    if (evtName === TreasuryEventName.DepositEvent) {
      return BalanceChangeType.AdminDeposit;
    }

    return BalanceChangeType.AdminWithdraw;
  }

  _genQueryFromRequestFilter({ type, fromDate, toDate, transactionId, userAddress }: IBalanceChangesFilter) {
    const query: FilterQuery<BalanceChangeDocument> = {};

    if (userAddress) {
      query.userAddress = userAddress;
    }

    if (type) {
      query.type = type;
    }

    if (transactionId) {
      query.transactionId = transactionId;
    }

    if (fromDate) {
      set(query, 'createdAt.$gte', fromDate);
    }

    if (toDate) {
      set(query, 'createdAt.$lte', toDate);
    }

    return query;
  }

  insertMany(entities: AnyKeys<BalanceChange>[], dto?: { session?: ClientSession }) {
    return this.model.insertMany(entities, { session: dto?.session });
  }

  create(entity: AnyKeys<BalanceChange>) {
    return this.model.create(entity);
  }

  _genAggregatePipeToStatisticTransaction(amount: number, type: BalanceChangeType) {
    const pipe: PipelineStage[] = [
      {
        $match: {
          $expr: {
            $gt: [
              '$createdAt',
              {
                $dateSubtract: {
                  startDate: '$$NOW',
                  unit: 'hour',
                  amount: amount,
                },
              },
            ],
          },
          type: type,
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
          change: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];

    return pipe;
  }

  async overviewStatistic() {
    const [
      depositLast24Hours,
      depositSevenDaysAgo,
      depositLast30Days,
      withdrawnLast24Hours,
      withdrawnSevenDaysAgo,
      withdrawnLast30Days,
    ] = await Promise.all([
      this.model.aggregate(
        this._genAggregatePipeToStatisticTransaction(TimeToHours.Last24Hours, BalanceChangeType.Deposit),
      ),
      this.model.aggregate(
        this._genAggregatePipeToStatisticTransaction(TimeToHours.SevenDaysAgo, BalanceChangeType.Deposit),
      ),
      this.model.aggregate(
        this._genAggregatePipeToStatisticTransaction(TimeToHours.Last30Days, BalanceChangeType.Deposit),
      ),
      this.model.aggregate(
        this._genAggregatePipeToStatisticTransaction(TimeToHours.Last24Hours, BalanceChangeType.Withdrawn),
      ),
      this.model.aggregate(
        this._genAggregatePipeToStatisticTransaction(TimeToHours.SevenDaysAgo, BalanceChangeType.Withdrawn),
      ),
      this.model.aggregate(
        this._genAggregatePipeToStatisticTransaction(TimeToHours.Last30Days, BalanceChangeType.Withdrawn),
      ),
    ]);

    const userStatistic = await this.userService.overviewStatistic();

    const data = {
      depositLast24Hours: tranformNullToStatisticData(depositLast24Hours[0]),
      depositSevenDaysAgo: tranformNullToStatisticData(depositSevenDaysAgo[0]),
      depositLast30Days: tranformNullToStatisticData(depositLast30Days[0]),
      withdrawnLast24Hours: tranformNullToStatisticData(withdrawnLast24Hours[0]),
      withdrawnSevenDaysAgo: tranformNullToStatisticData(withdrawnSevenDaysAgo[0]),
      withdrawnLast30Days: tranformNullToStatisticData(withdrawnLast30Days[0]),
      ...userStatistic,
    };

    return data;
  }
}
