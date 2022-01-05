import { Injectable, OnModuleInit } from '@nestjs/common';
import { Program, Provider, Wallet } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createKeypairBase58 } from 'src/common/utils';
import { IDL } from 'src/modules/treasury-event/treasury.idl';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class TreasuryGetterService implements OnModuleInit {
  readonly programId: string;

  readonly provider: Provider;

  readonly token: Token;

  private _tokenDecimals: number;

  readonly program: Program;

  readonly treasuryAccount: PublicKey;

  private _treasuryTokenAccount: PublicKey;

  readonly gameOwnerKeyPair: Keypair;

  readonly gameId: PublicKey;

  readonly pdaSeed: Buffer;

  readonly connection: Connection;

  constructor(readonly configService: ApiConfigService) {
    this.programId = configService.blockchain.programId;

    const wallet = new Wallet(Keypair.generate());

    this.connection = new Connection(configService.blockchain.rpcEndpoint, 'finalized');

    this.provider = new Provider(this.connection, wallet, {});
    this.program = new Program(IDL, this.programId, this.provider);

    this.token = new Token(
      this.provider.connection,
      new PublicKey(configService.mintToken.address),
      TOKEN_PROGRAM_ID,
      wallet.payer,
    );

    this.gameOwnerKeyPair = createKeypairBase58(configService.blockchain.gameOwnerPK);

    this.treasuryAccount = new PublicKey(configService.blockchain.treasuryAccount);

    this.gameId = new PublicKey(configService.blockchain.gameId);

    this.pdaSeed = Buffer.from(configService.blockchain.pdaSeed);
  }

  async onModuleInit() {
    const [[treasuryTokenAccount], { decimals }] = await Promise.all([
      PublicKey.findProgramAddress(
        [this.pdaSeed, this.gameId.toBuffer(), this.token.publicKey.toBuffer()],
        this.program.programId,
      ),
      this.token.getMintInfo(),
    ]);

    this._tokenDecimals = decimals;
    this._treasuryTokenAccount = treasuryTokenAccount;
  }

  get treasuryTokenAccount() {
    return this._treasuryTokenAccount;
  }

  get tokenDecimals() {
    return this._tokenDecimals;
  }

  async getTreasuryBalance() {
    const { token, treasuryTokenAccount, treasuryAccount } = this;
    const { amount } = await token.getAccountInfo(treasuryTokenAccount);

    return {
      balance: amount.toString(),
      address: treasuryAccount.toBase58(),
    };
  }
}
