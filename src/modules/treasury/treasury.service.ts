import { Injectable } from '@nestjs/common';
import { getMintInfo } from '@project-serum/common';
import { ApiConfigService, TreasuryGetterService } from '../shared/services';
import { TokenInfoResponse, TreasuryResponse } from './dto';

@Injectable()
export class TreasuryService {
  constructor(readonly configService: ApiConfigService, readonly treasuryGetterService: TreasuryGetterService) {}

  async getTreasuryInfo(): Promise<TreasuryResponse> {
    const { token, treasuryTokenAccount, treasuryAccount } = this.treasuryGetterService;
    const { amount } = await token.getAccountInfo(treasuryTokenAccount);

    return {
      balance: amount.toString(),
      address: treasuryAccount.toBase58(),
    };
  }

  async getTokenInfo(): Promise<TokenInfoResponse> {
    const { decimals, supply } = await getMintInfo(
      this.treasuryGetterService.provider,
      this.treasuryGetterService.token.publicKey,
    );

    return { decimals, totalSupply: supply.toString(), ...this.configService.mintToken };
  }
}
