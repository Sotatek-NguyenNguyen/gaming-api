import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiConfigService } from '../shared/services';
import { UpdateGameInfoRequest } from './dto';
import { GameInfo, GameInfoDocument } from './game-info.schema';

@Injectable()
export class GameInfoService implements OnModuleInit {
  constructor(
    @InjectModel(GameInfo.name) readonly model: Model<GameInfoDocument>,
    readonly configService: ApiConfigService,
  ) {}

  async onModuleInit() {
    const gameInfo = await this.model.findOne();

    if (!gameInfo) {
      await this.model.create({});
    }
  }

  async get() {
    const gameInfo = await this.model.findOne().lean({ virtuals: true });

    return { ...gameInfo, ...this._getAdditionalData() };
  }

  async update(dto: UpdateGameInfoRequest) {
    const gameInfo = await this.model.findOneAndUpdate({}, dto, { new: true }).lean({ virtuals: true });

    return { ...gameInfo, ...this._getAdditionalData() };
  }

  private _getAdditionalData() {
    return {
      walletAddress: this.configService.blockchain.treasuryAccount,
      currencyCode: this.configService.mintToken.symbol,
      currencyName: this.configService.mintToken.name,
    };
  }
}
