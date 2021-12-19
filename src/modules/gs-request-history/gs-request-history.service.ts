import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { GsHelperService } from '../shared/services';
import { GsRequestHistory, GsRequestHistoryDocument } from './gs-request-history.schema';
import { ICreateGsRequestHistory } from './interfaces';

@Injectable()
export class GsRequestHistoryService {
  constructor(
    @InjectModel(GsRequestHistory.name) readonly model: Model<GsRequestHistoryDocument>,
    private readonly gsHelperService: GsHelperService,
  ) {}

  create(dto: ICreateGsRequestHistory, session: ClientSession) {
    return this.model.insertMany([dto], { session });
  }
}
