import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import { IDataWithPagination } from 'src/common/interfaces';
import { INftFilter } from './interfaces';
import { NftItem, NftItemDocument } from './nft-item.schema';
import { sleep } from 'src/common/utils';

@Injectable()
export class NftItemService {
  constructor(@InjectModel(NftItem.name) readonly model: Model<NftItemDocument>) {}

  async list(filter: INftFilter): Promise<IDataWithPagination<NftItem>> {
    const query = this._genQueryFromRequestFilter(filter);
    const { page, pageSize } = filter;

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean({ virtuals: true }),
      this.model.count(query),
    ]);

    return { data, page, pageSize, total, totalPage: Math.ceil(total / pageSize) };
  }

  getNftByAddress(address: string) {
    return this.model.findOne({ address: address }).lean({ virtuals: true });
  }

  _genQueryFromRequestFilter({ userAddress, address, gameItemId }: INftFilter) {
    const query: FilterQuery<NftItemDocument> = {};

    if (userAddress) {
      query.userAddress = userAddress;
    }

    if (address) {
      query.address = address;
    }

    if (gameItemId) {
      query.gameItemId = gameItemId;
    }

    return query;
  }

  insertMany(entities: AnyKeys<NftItem>[]) {
    return this.model.insertMany(entities);
  }

  async nftItemScan() {
    const innerFunction = async () => {
      const pageSize = 10;
      let page = 1;

      while (true) {
        const nfts = await this.model
          .find()
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean({ virtuals: true });
        console.log(nfts);

        if (nfts.length < pageSize) {
          page = 1;
          break;
        } else {
          page++;
        }
      }
    };

    while (true) {
      await innerFunction();
      await sleep(5 * 1000);
    }
  }
}
