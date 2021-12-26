import { Injectable } from '@nestjs/common';
import { Provider, Wallet } from '@project-serum/anchor';
import { getMintInfo } from '@project-serum/common';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { ApiConfigService } from '../shared/services';
import { TokenInfoResponse, TreasuryResponse } from './dto';

@Injectable()
export class TreasuryService {
  private finalizeConnection: Connection;

  private provider: Provider;

  private mintTokenAddress: PublicKey;

  private treasuryAccountAddress: PublicKey;

  constructor(readonly configService: ApiConfigService) {
    this.finalizeConnection = new Connection(this.configService.blockchain.rpcEndpoint, 'finalized');
    this.mintTokenAddress = new PublicKey(this.configService.mintToken.address);
    this.treasuryAccountAddress = new PublicKey(this.configService.blockchain.treasuryAccount);

    const keypair = Keypair.generate();
    const wallet = new Wallet(keypair);
    this.provider = new Provider(this.finalizeConnection, wallet, {});
  }

  async getTreasuryInfo(): Promise<TreasuryResponse> {
    const data = await this.finalizeConnection.getParsedTokenAccountsByOwner(this.treasuryAccountAddress, {
      mint: this.mintTokenAddress,
    });

    return {
      balance: data?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || 0,
      address: this.configService.blockchain.treasuryAccount,
    };
  }

  async getTokenInfo(): Promise<TokenInfoResponse> {
    const { decimals, supply } = await getMintInfo(this.provider, this.mintTokenAddress);

    return { decimals, totalSupply: supply.toString(), ...this.configService.mintToken };
  }
}
