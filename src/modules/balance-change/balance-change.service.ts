import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BalanceChange, BalanceChangeDocument } from './balance-change.schema';

@Injectable()
export class BalanceChangeService {
  constructor(@InjectModel(BalanceChange.name) readonly model: Model<BalanceChangeDocument>) {}
}
