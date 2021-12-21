import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { set } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { IDataWithPagination } from 'src/common/interfaces';
import { GsRequestHistoryService } from '../gs-request-history/gs-request-history.service';
import { GsHelperService } from '../shared/services';
import { UserService } from '../user/user.service';
import { BalanceChangeType } from './balance-change.enum';
import { BalanceChange, BalanceChangeDocument } from './balance-change.schema';
import { SubmitBalanceChangeRequest } from './dto';
import { IBalanceChangesFilter } from './interfaces';

@Injectable()
export class BalanceChangeService {
  constructor(
    @InjectModel(BalanceChange.name) readonly model: Model<BalanceChangeDocument>,
    private readonly gsRequestHistoryService: GsRequestHistoryService,
    private readonly gsHelperService: GsHelperService,
    private readonly userService: UserService,
  ) {}

  listTransactionHistory(filter: IBalanceChangesFilter) {
    return this._list(filter, { type: { $in: [BalanceChangeType.Deposit, BalanceChangeType.Withdrawn] } });
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
      session.startTransaction();

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

      await this.gsRequestHistoryService.create(
        { requestId: dto.requestId, dataResponse: { success: true }, statusResponse: 200 },
        session,
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      throw error;
    }

    await session.endSession();

    await this.gsHelperService.saveRequestDataToRedis({
      requestId: dto.requestId,
      dataResponse: { success: true },
      statusResponse: 200,
    });

    return { success: true };
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
        .sort({ _id: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.model.count(query),
    ]);

    return { data, page, pageSize, total, totalPage: Math.ceil(total / pageSize) };
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
      set(query, 'createdAt.$lte', fromDate);
    }

    return query;
  }
}
