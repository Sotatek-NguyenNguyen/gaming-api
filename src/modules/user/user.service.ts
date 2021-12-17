import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from 'src/common/constant';
import { ApiConfigService } from '../shared/services';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    readonly configService: ApiConfigService,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  async checkUserExistByAddress(address: string) {
    const user = await this.getUserByAddress(address);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return user;
  }

  create({ address, accountInGameId }: { address: string; accountInGameId: string | number }) {
    return this.model.create({
      address,
      accountInGameId,
      nonce: 10,
    });
  }

  getUserByAddress(address: string) {
    return this.model.findOne({ address }).lean({ virtuals: true });
  }

  async getNonceByAddress(address: string) {
    let user = await this.getUserByAddress(address);

    if (!user) {
      user = await this.create({ address, accountInGameId: 1 });
    }

    return user.nonce;
  }

  async generateNewNonce(userId: string) {
    //
  }

  async isAdmin(address: string) {
    const admin = await this.model.findOne({ address, role: UserRole.Admin });

    if (!admin) {
      throw new ForbiddenException('');
    }

    return admin;
  }
}
