import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import { Client, JSONRPCErrorLike, JSONRPCRequest } from 'jayson';
import { URL } from 'url';
import { keyBy } from 'lodash';
import { AccountLayout } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { IDataWithPagination } from 'src/common/interfaces';
import { INftFilter } from './interfaces';
import { NftItem, NftItemDocument } from './nft-item.schema';
import { sleep } from 'src/common/utils';
import { ApiConfigService } from '../shared/services';
import { NftItemStatus } from './enum';

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
        console.log(`Processing page=${page} pageSize=${pageSize}`);
        const nfts = await this.model
          .find({
            status: NftItemStatus.Minted,
          })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean({ virtuals: true });
        if (nfts.length === 0) {
          page = 1;
          break;
        }

        const nftIds = nfts.map((nft) => nft.address);
        await this._processNftIds(nftIds);

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

  private async _processNftIds(nftIds: string[]) {
    const tokenAccountRequests = nftIds.map((nftId) =>
      this.jsonRpcClient.request('getTokenLargestAccounts', [nftId, { commitment: 'finalized' }]),
    );
    const tokenAccountRequestsById = keyBy(tokenAccountRequests, 'id');
    const { successes: tokenAccountResponses } = await this._asyncBatchRequest(tokenAccountRequests);
    if (tokenAccountResponses.length === 0) {
      return;
    }

    const noOwnerTokens = [];
    const tokenAccountIds = [];
    let latestSlot = 0;
    for (const tokenAccountResponse of tokenAccountResponses) {
      const { value, context } = tokenAccountResponse.result;
      latestSlot = context.slot;
      if (!value || value.length == 0) {
        const requestId = tokenAccountResponse.id;
        const request = tokenAccountRequestsById[requestId];
        noOwnerTokens.push(request.params[0]);
        continue;
      }

      const tokenAccountInfo = value[0];
      if (tokenAccountInfo.amount !== '1') {
        const requestId = tokenAccountResponse.id;
        const request = tokenAccountRequestsById[requestId];
        noOwnerTokens.push(request.params[0]);
        continue;
      }

      tokenAccountIds.push(tokenAccountInfo.address);
    }

    if (noOwnerTokens.length) {
      await this.model.bulkWrite(
        noOwnerTokens.map((tokenId) => ({
          updateOne: {
            filter: { address: tokenId },
            update: { $set: { userAddress: '' } },
          },
        })),
      );
    }

    if (tokenAccountIds.length) {
      const tokenOwnerRequests = tokenAccountIds.map((id) =>
        this.jsonRpcClient.request('getAccountInfo', [id, { commitment: 'finalized', encoding: 'base64' }]),
      );
      const { successes: tokenOwnerResponses } = await this._asyncBatchRequest(tokenOwnerRequests);
      if (tokenOwnerResponses.length === 0) {
        return;
      }

      const accounts = tokenOwnerResponses.map((response) => {
        const rawAccount = response.result.value.data[0];
        const decoded = AccountLayout.decode(Buffer.from(rawAccount, 'base64'));
        return { mint: new PublicKey(decoded.mint).toBase58(), owner: new PublicKey(decoded.owner).toBase58() };
      });

      await this.model.bulkWrite(
        accounts.map((account) => ({
          updateOne: {
            filter: { address: account.mint, userAddress: { $ne: account.owner } },
            update: { $set: { userAddress: account.owner } },
          },
        })),
      );
    }

    console.log(`Done ${latestSlot}`);
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
