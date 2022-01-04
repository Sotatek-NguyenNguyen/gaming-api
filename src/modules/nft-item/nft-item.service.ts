import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import { Client, JSONRPCErrorLike, JSONRPCRequest } from 'jayson';
import { URL } from 'url';
import { IDataWithPagination } from 'src/common/interfaces';
import { INftFilter } from './interfaces';
import { NftItem, NftItemDocument } from './nft-item.schema';
import { sleep } from 'src/common/utils';
import { ApiConfigService } from '../shared/services';

@Injectable()
export class NftItemService {
  private jsonRpcClient: Client;

  constructor(@InjectModel(NftItem.name) readonly model: Model<NftItemDocument>, configService: ApiConfigService) {
    this.jsonRpcClient = Client.https({ host: new URL(configService.blockchain.rpcEndpoint).hostname });
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
          this.jsonRpcClient.request('getTokenLargestAccounts', [nftId, { commitment: 'finalized' }]),
        );
        const { successes } = await this._asyncBatchRequest(batch);
        console.log(successes);

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

  private async _asyncBatchRequest(batch: JSONRPCRequest[]): Promise<{ successes: any; errors: JSONRPCErrorLike[] }> {
    return new Promise((resolve, reject) => {
      this.jsonRpcClient.request(batch, (err, errors, successes) => {
        if (err) {
          return reject(err);
        }
        return resolve({ errors, successes });
      });
    });
  }
}
