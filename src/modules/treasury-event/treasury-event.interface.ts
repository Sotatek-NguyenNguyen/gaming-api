import { BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { TreasuryEventName } from 'src/common/constant';

export interface IDecodedEventFromTreasury {
  data: {
    user: PublicKey;
    gameId: PublicKey;
    tokenId: PublicKey;
    sender: PublicKey;
    withdrawalId: string;
    amount: BN;
    timestamp: BN;
    nftId?: PublicKey;
  };
  name: TreasuryEventName;
}
