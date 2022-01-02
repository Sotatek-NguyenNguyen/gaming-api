import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import { Client } from 'jayson';
import { IDataWithPagination } from 'src/common/interfaces';
import { INftFilter } from './interfaces';
import { NftItem, NftItemDocument } from './nft-item.schema';
import { sleep } from 'src/common/utils';
import { ApiConfigService } from '../shared/services';

@Injectable()
export class NftItemService {
  private jaysonClient: Client;

  constructor(@InjectModel(NftItem.name) readonly model: Model<NftItemDocument>, configService: ApiConfigService) {
    this.jaysonClient = Client.https({ host: 'api.devnet.solana.com' });
  }

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
        if (nfts.length === 0) {
          page = 1;
          break;
        }

        const nftIds = nfts.map((nft) => nft.address);
        const batch = nftIds.map((nftId) =>
          this.jaysonClient.request('getTokenLargestAccounts', [nftId, { commitment: 'finalized' }]),
        );
        await this.jaysonClient.request(batch, function (err, errors, successes) {
          if (err) throw err;
          console.log('errors', errors); // array of requests that errored
          console.log('successes', successes); // array of requests that succeeded
        });
        // const info = await this.finalizeConnection.getTokenLargestAccounts(new PublicKey(nft.address));
        // console.log(info);

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
      await sleep(60 * 1000);
    }
  }
}
