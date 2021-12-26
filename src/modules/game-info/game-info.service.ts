import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Redis } from 'ioredis';
import { Model } from 'mongoose';
import { GameServerUrlRedisKey } from 'src/common/constant';
import { ApiConfigService } from '../shared/services';
import { UpdateGameInfoRequest } from './dto';
import { GameInfo, GameInfoDocument } from './game-info.schema';

@Injectable()
export class GameInfoService implements OnModuleInit {
  constructor(
    @InjectModel(GameInfo.name) readonly model: Model<GameInfoDocument>,
    @InjectRedis() readonly redis: Redis,
    readonly configService: ApiConfigService,
  ) {}

  async onModuleInit() {
    const gameInfo = await this.model.findOne();

    if (!gameInfo) {
      return this.model.create({});
    }

    await this.redis.mset(
      GameServerUrlRedisKey.Webhook,
      gameInfo.webhookUrl,
      GameServerUrlRedisKey.GetItemUrl,
      gameInfo.getItemUrl,
    );
  }

  async get() {
    const gameInfo = await this.model.findOne().lean({ virtuals: true });

    return { ...gameInfo, ...this._getAdditionalData() };
  }

  async update(dto: UpdateGameInfoRequest) {
    const gameInfo = await this.model.findOneAndUpdate({}, dto, { new: true }).lean({ virtuals: true });

    await this.redis.mset(
      GameServerUrlRedisKey.Webhook,
      gameInfo.webhookUrl,
      GameServerUrlRedisKey.GetItemUrl,
      gameInfo.getItemUrl,
    );

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
