import { PublicKey } from '@solana/web3.js';

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(process.env.MINT_TOKEN_METADATA_PROGRAM_ID);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  process.env.MINT_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
);

export const TOKEN_PROGRAM_ID = new PublicKey(process.env.MINT_TOKEN_PROGRAM_ID);
