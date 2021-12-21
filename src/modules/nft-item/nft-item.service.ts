import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IDataWithPagination } from 'src/common/interfaces';
import { UserService } from '../user/user.service';
import { NftItem, NftItemDocument } from './nft-item.schema';
import { INftFilter } from './interfaces';
import { ListCurrentUserNftQuery } from './dto';

@Injectable()
export class NftItemService {
  constructor(@InjectModel(NftItem.name) readonly model: Model<NftItemDocument>, readonly userService: UserService) {}

  getNftData(filter: INftFilter) {
    return this._list(filter);
  }

  async getNftDataWithUserAddress(query: ListCurrentUserNftQuery, userAddress: string): Promise<any> {
    const filter = {
      userAddress: userAddress,
      page: query.page,
      pageSize: query.pageSize,
      address: query.address,
    };
    return this.getNftData(filter);
  }

  async _list(filter: INftFilter): Promise<IDataWithPagination<NftItem>> {
    const query = Object.assign(this._genQueryFromRequestFilter(filter));
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
    return this.model.find({ address: address });
  }
}
