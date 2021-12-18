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
      await this.model.create({
        walletAddress: this.configService.walletAddress,
      });
    }
  }

  get() {
    return this.model.findOne().lean({ virtuals: true });
  }

  update(dto: UpdateGameInfoRequest) {
    return this.model.findOneAndUpdate({}, dto, { new: true }).lean({ virtuals: true });
  }
}
