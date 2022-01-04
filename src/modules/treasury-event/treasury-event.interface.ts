import { BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { TreasuryEventName } from 'src/common/constant';

export interface IDecodedDepositEventFromTreasury {
  data: {
    user: PublicKey;
    gameId: PublicKey;
    tokenId: PublicKey;
    sender: PublicKey;
    withdrawalId: string;
    amount: BN;
    timestamp: BN;
  };
  name: TreasuryEventName;
}
