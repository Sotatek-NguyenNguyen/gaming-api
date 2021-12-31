import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
export const createKeypairBase58 = (secretKeyString: string): Keypair => {
  const secretBuffer = bs58.decode(secretKeyString);
  const secretKey = Uint8Array.from(secretBuffer);
  return Keypair.fromSecretKey(secretKey);
};

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const isArrayNotEmpty = (arr) => Array.isArray(arr) && arr.length;

export const generateRandomNumber = () => Math.round(Math.random() * 10000);

export const tranformNullToStatisticData = (x: any) => {
  if (!x) return { amount: 0, change: 0 };
  return x;
};
