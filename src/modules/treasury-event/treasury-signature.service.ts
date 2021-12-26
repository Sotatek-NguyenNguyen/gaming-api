import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Connection, PublicKey, SignaturesForAddressOptions } from '@solana/web3.js';
import { Model } from 'mongoose';
import { sleep } from 'src/common/utils';
import { ApiConfigService } from '../shared/services';
import { LatestSignature, LatestSignatureDocument, Signature, SignatureDocument } from './schema';

@Injectable()
export class TreasurySignatureService {
  private clusterHost: string;

  constructor(
    @InjectModel(Signature.name)
    private readonly signatureModel: Model<SignatureDocument>,
    @InjectModel(LatestSignature.name)
    private readonly latestSignatureModel: Model<LatestSignatureDocument>,
    private readonly configService: ApiConfigService,
  ) {
    this.clusterHost = configService.blockchain.rpcEndpoint;
  }

  /**
   * from account to signatures
   * listen to treasury account (unique by gameId)
   */
  async crawl() {
    const finalizeConnection = new Connection(this.clusterHost, 'finalized');
    const treasuryAccount = this.configService.blockchain.treasuryAccount;

    let latestSignature = (
      await this.latestSignatureModel
        .findOne({
          programPk: treasuryAccount,
        })
        .lean({ virtuals: true })
    )?.signature;

    while (true) {
      latestSignature = await this._treasurySignature(finalizeConnection, treasuryAccount, latestSignature);
      await sleep(5 * 1000);
    }
  }

  private async _treasurySignature(
    finalizeConnection: Connection,
    treasuryAccount: string,
    latestSignature: string | null,
  ): Promise<string> {
    let reversedSignatures = [];
    let before = null;
    const limit = 1;

    while (true) {
      const options: SignaturesForAddressOptions = { limit };
      options.before = before;
      options.until = latestSignature;

      const fetchedSignatures = await finalizeConnection.getSignaturesForAddress(
        new PublicKey(treasuryAccount),
        options,
      );
      reversedSignatures = reversedSignatures.concat(fetchedSignatures);

      if (fetchedSignatures.length < limit) {
        break;
      }

      before = reversedSignatures[reversedSignatures.length - 1].signature;

      await sleep(500);
    }

    if (reversedSignatures.length === 0) {
      console.log('empty signatures');
      return latestSignature;
    }

    const signatures = reversedSignatures.reverse();
    await this.signatureModel.bulkWrite(
      signatures.map((signature) => ({
        updateOne: {
          filter: { signature: signature.signature },
          update: { $set: signature },
          upsert: true,
        },
      })),
    );

    latestSignature = signatures[signatures.length - 1].signature;
    await this.latestSignatureModel.updateOne(
      { programPk: treasuryAccount },
      {
        programPk: treasuryAccount,
        signature: latestSignature,
      },
      { upsert: true },
    );

    return latestSignature;
  }
}
