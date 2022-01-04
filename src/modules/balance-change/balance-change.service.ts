import { User, UserDocument } from '../user/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { set } from 'lodash';
import { AnyKeys, ClientSession, FilterQuery, Model } from 'mongoose';
import { TimeToHours, TreasuryEventName, UserRole } from 'src/common/constant';
import { IDataWithPagination } from 'src/common/interfaces';
import { GsRequestHistoryService } from '../gs-request-history/gs-request-history.service';
import { GsHelperService } from '../shared/services';
import { ITreasuryDepositEventConsumerPayload } from '../treasury-event-consumer/interfaces';
import { UserService } from '../user/user.service';
import { BalanceChangeType } from './balance-change.enum';
import { BalanceChange, BalanceChangeDocument } from './balance-change.schema';
import { SubmitBalanceChangeRequest } from './dto';
import { IBalanceChangesFilter } from './interfaces';
import { tranformNullToStatisticData } from 'src/common/utils';

@Injectable()
export class BalanceChangeService {
  constructor(
    @InjectModel(BalanceChange.name) readonly model: Model<BalanceChangeDocument>,
    private readonly gsRequestHistoryService: GsRequestHistoryService,
    private readonly gsHelperService: GsHelperService,
    private readonly userService: UserService,
  ) {}

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
  }: ITreasuryDepositEventConsumerPayload) {
    const user = await this.userService.checkUserExistByAddress(userAddress);
    const isPlayer = user.role === UserRole.Player;
    const balanceChangeType = this._getBcTypeFromTreasuryEvent(evtName, isPlayer);

    const session = await this.model.startSession();

    try {
      await session.withTransaction(() =>
        Promise.all([
          this.model.create(
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
          isPlayer &&
            this.userService.bulkUpdateUserBalanceByAddress(
              [
                {
                  address: userAddress,
                  amount: +(evtName === TreasuryEventName.DepositEvent ? amount : -amount),
                  balanceChangeType,
                },
              ],
              session,
            ),
        ]),
      );
    } finally {
      await session.endSession();
    }

    return { notifyGameServer: isPlayer };
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

  _genAggregatePipeToStatisticTransaction(amount: number, type: BalanceChangeType) {
    const pipe = [
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
