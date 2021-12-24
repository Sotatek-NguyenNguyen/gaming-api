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

  private erc20TokenAddress: PublicKey;

  private treasuryAddress: PublicKey;

  constructor(readonly configService: ApiConfigService) {
    this.finalizeConnection = new Connection(this.configService.blockchain.rpcEndpoint, 'finalized');
    this.erc20TokenAddress = new PublicKey(this.configService.erc20Token.address);
    this.treasuryAddress = new PublicKey(this.configService.blockchain.treasuryContractAddress);

    const keypair = Keypair.generate();
    const wallet = new Wallet(keypair);
    this.provider = new Provider(this.finalizeConnection, wallet, {});
  }

  async getTreasuryInfo(): Promise<TreasuryResponse> {
    const data = await this.finalizeConnection.getParsedTokenAccountsByOwner(this.treasuryAddress, {
      mint: this.erc20TokenAddress,
    });

    return {
      balance: data?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || 0,
      address: this.configService.blockchain.treasuryContractAddress,
    };
  }

  async getTokenInfo(): Promise<TokenInfoResponse> {
    const { decimals, supply } = await getMintInfo(this.provider, this.erc20TokenAddress);

    return { decimals, totalSupply: supply.toString(), ...this.configService.erc20Token };
  }
}
