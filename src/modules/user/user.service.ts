import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { UserRole } from 'src/common/constant';
import { generateRandomNumber } from 'src/common/utils';
import { ApiConfigService } from '../shared/services';
import { ListUserQuery, ListUserResponse, UserResponse } from './dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    readonly configService: ApiConfigService,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  async list(filter: ListUserQuery): Promise<ListUserResponse> {
    const { page, pageSize } = filter;
    const query = this._getFilterQuery(filter);

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.model.count(query),
    ]);

    return {
      data: this.mapper.mapArray(data, UserResponse, User),
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  }

  async checkUserExistByAddress(address: string) {
    const user = await this.getUserByAddress(address);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return user;
  }

  async checkUsersExist(addresses: string[]) {
    const users = await this.model.find({ address: { $in: addresses } });

    if (users.length !== addresses.length) {
      throw new NotFoundException('USERS_NOT_FOUND');
    }

    return users;
  }

  create({
    address,
    accountInGameId,
    balance,
  }: {
    address: string;
    accountInGameId?: string | number;
    balance?: number;
  }) {
    return this.model.create({
      address,
      accountInGameId,
      balance,
      nonce: generateRandomNumber(),
    });
  }

  bulkUpdateUserBalanceByAddress(dto: { address: string; amount: number }[], session?: ClientSession) {
    return this.model.bulkWrite(
      dto.map(({ address, amount }) => ({
        updateOne: {
          filter: { address },
          update: { $inc: { balance: amount } },
        },
      })),
      { session },
    );
  }

  getUserByAddress(address: string) {
    return this.model.findOne({ address }).lean({ virtuals: true });
  }

  generateNewNonce(userId: string) {
    return this.model.findOneAndUpdate(
      { _id: userId },
      {
        nonce: generateRandomNumber(),
      },
    );
  }

  async isAdmin(address: string) {
    const admin = await this.model.findOne({ address, role: UserRole.Admin });

    if (!admin) {
      throw new ForbiddenException();
    }

    return admin;
  }

  _getFilterQuery({ address, accountInGameId }: ListUserQuery) {
    const query: FilterQuery<UserDocument> = {};

    if (address) {
      query.address = address;
    }

    if (accountInGameId) {
      query.accountInGameId = accountInGameId;
    }

    return query;
  }
}
