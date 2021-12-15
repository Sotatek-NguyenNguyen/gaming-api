import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NftItem, NftItemDocument } from './nft-item.schema';

@Injectable()
export class NftItemService {
  constructor(@InjectModel(NftItem.name) readonly model: Model<NftItemDocument>) {}
}
