import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto';
import { GsNotifyConsumerPayload } from '../treasury-event-consumer/interfaces';
import {
  CreateGsGameItemRequest,
  GsdValidateGameItemRequest,
  GsdValidateGameItemResponse,
  GsGameItemResponse,
  ListGsGameItemResponse,
} from './dto';
import { CreatePlayerRequest, ListPlayerResponse, PlayerResponse } from './dto/gsd-player.dto';
import { GsEvent, GsEventDocument, GsGameItem, GsPlayer, GsPlayerDocument } from './schema';

@Injectable()
export class GameServerDummyService {
  constructor(
    @InjectModel(GsPlayer.name) readonly playerModel: Model<GsPlayerDocument>,
    @InjectModel(GsEvent.name) readonly eventModel: Model<GsEventDocument>,
    @InjectModel(GsGameItem.name) readonly gameItemModel: Model<GsGameItem>,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  handleEventFromGaming(dto: GsNotifyConsumerPayload) {
    return this.eventModel.create(dto);
  }

  async validateGameItem({ userAddress, itemId }: GsdValidateGameItemRequest): Promise<GsdValidateGameItemResponse> {
    const gameItem = await this.gameItemModel.findOne({ _id: itemId, userAddress });

    if (!gameItem) {
      throw new NotFoundException('GAME_ITEM_NOT_FOUND');
    }

    return {
      itemId,
      itemImage: gameItem.image,
      itemName: gameItem.name,
      metadata: {},
    };
  }

  async getListPlayer(filter: PaginationQueryDto): Promise<ListPlayerResponse> {
    const { page, pageSize } = filter;

    const [data, total] = await Promise.all([
      this.playerModel
        .find()
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.playerModel.count(),
    ]);

    return {
      data: this.mapper.mapArray(data, PlayerResponse, GsPlayer),
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  }

  async createPlayer(dto: CreatePlayerRequest) {
    return (await this.playerModel.create(dto)).toObject();
  }

  async getListGameItem(filter: PaginationQueryDto): Promise<ListGsGameItemResponse> {
    const { page, pageSize } = filter;

    const [data, total] = await Promise.all([
      this.gameItemModel
        .find()
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.playerModel.count(),
    ]);

    return {
      data: this.mapper.mapArray(data, GsGameItemResponse, GsGameItem),
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  }

  async createGameItem(dto: CreateGsGameItemRequest) {
    return (await this.gameItemModel.create(dto)).toObject();
  }
}
