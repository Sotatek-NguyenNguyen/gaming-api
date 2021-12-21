import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IDataWithPagination } from 'src/common/interfaces';
import { NftItem, NftItemDocument } from './nft-item.schema';
import { INftFilter } from './interfaces';
import { ListCurrentUserNftQuery } from './dto';

@Injectable()
export class NftItemService {
  constructor(@InjectModel(NftItem.name) readonly model: Model<NftItemDocument>) {}

  getNftData(filter: INftFilter) {
    console.log(filter);
    return this.list(filter);
  }

  async list(filter: INftFilter): Promise<IDataWithPagination<NftItem>> {
    const query = this._genQueryFromRequestFilter(filter);
    const { page, pageSize } = filter;

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ _id: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.model.count(query),
    ]);

    return { data, page, pageSize, total, totalPage: Math.ceil(total / pageSize) };
  }

  _genQueryFromRequestFilter({ userAddress, address }: INftFilter) {
    const query: FilterQuery<NftItemDocument> = {};

    if (userAddress) {
      query.userAddress = userAddress;
    }

    if (address) {
      query.address = address;
    }

    return query;
  }

  async getNftDataWithNFTAddress(address: string): Promise<any> {
    return this.model.findOne({ address: address }).lean({ virtuals: true });
  }
}
