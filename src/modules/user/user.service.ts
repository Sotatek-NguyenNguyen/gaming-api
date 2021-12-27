import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { ClientSession, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { UserRole } from 'src/common/constant';
import { generateRandomNumber } from 'src/common/utils';
import { BalanceChangeType } from '../balance-change/balance-change.enum';
import { ApiConfigService, TreasuryGetterService } from '../shared/services';
import { ListUserQuery, ListUserResponse, UserResponse, UserWithdrawRequest, UserWithdrawResponse } from './dto';
import { User, UserDocument } from './user.schema';
import { dayjs } from 'src/common/pkg/dayjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    readonly configService: ApiConfigService,
    readonly treasuryGetterService: TreasuryGetterService,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCron() {
    if (this.configService.isMasterProcess) {
      return this.model.updateMany(
        { isRequestingWithdraw: true, lastRequestWithdrawAt: dayjs().subtract(1, 'hour').toDate() },
        {
          $set: {
            isRequestingWithdraw: false,
          },
        },
      );
    }
  }

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

  bulkUpdateUserBalanceByAddress(
    dto: { address: string; amount: number; balanceChangeType?: BalanceChangeType }[],
    session?: ClientSession,
  ) {
    return this.model.bulkWrite(
      dto.map(({ address, amount, balanceChangeType }) => {
        const updateObj: UpdateQuery<UserDocument> = {
          $inc: { balance: amount },
        };

        if (balanceChangeType === BalanceChangeType.Withdrawn) {
          updateObj.$set = {
            isRequestingWithdraw: false,
          };
        }

        return {
          updateOne: {
            filter: { address },
            update: updateObj,
          },
        };
      }),
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

  async userWithdraw(userAddress: string, { amount }: UserWithdrawRequest): Promise<UserWithdrawResponse> {
    const user = await this.model.findOneAndUpdate(
      { address: userAddress, balance: { $gte: amount }, isRequestingWithdraw: { $in: [null, false] } },
      {
        $set: {
          isRequestingWithdraw: true,
          lastRequestWithdrawAt: new Date(),
        },
      },
    );

    if (!user) {
      throw new BadRequestException('USER_BALANCE_IS_NOT_ENOUGH_OR_USER_HAS_PENDING_WITHDRAW_REQUEST');
    }

    try {
      const {
        provider,
        program,
        token,
        gameOwnerKeyPair: owner,
        treasuryAccount,
        treasuryTokenAccount,
        gameId,
      } = this.treasuryGetterService;

      const withdrawAccount = new PublicKey(userAddress);
      const withdrawnTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        token.publicKey,
        withdrawAccount,
      );

      // Server create tx and sign
      const tx = await program.transaction.withdraw(gameId, new BN(amount), {
        accounts: {
          owner: owner.publicKey,
          sender: withdrawAccount,
          withdrawUser: withdrawAccount,
          treasuryAccount,
          treasuryTokenAccount,
          withdrawTokenAccount: withdrawnTokenAccount,
          tokenId: token.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
      });

      tx.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      tx.feePayer = withdrawAccount;
      tx.partialSign(owner);

      const serializedTx = tx.serialize({ verifySignatures: false }).toString('base64');

      return {
        serializedTx,
      };
    } catch (error) {
      await this.model.updateOne(
        { address: userAddress, isRequestingWithdraw: true },
        {
          $set: {
            isRequestingWithdraw: false,
          },
        },
      );

      throw error;
    }
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
