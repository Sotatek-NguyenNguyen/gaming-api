import { calculate } from '@metaplex/arweave-cost';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BN } from '@project-serum/anchor';
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { serialize } from 'borsh';
import FormData from 'form-data';
import fs from 'fs';
import fsPromises from 'fs/promises';
import mimeTypes from 'mime-types';
import { Model } from 'mongoose';
import path from 'path';
import { http } from 'src/common/http';
import { Stream } from 'stream';
import { ApiConfigService, GsHelperService, TreasuryGetterService } from '../shared/services';
import { ITreasuryDepositEventConsumerPayload } from '../treasury-event-consumer/interfaces';
import { ArweaveMetadata, ArweaveUploadPaymentRequest, ArweaveUploadPaymentResponse, MintNftItemRequest } from './dto';
import { NftItemStatus } from './enum';
import { getMasterEdition, getMetadata, getTokenWallet } from './helpers/accounts';
import {
  createAssociatedTokenAccountInstruction,
  createMasterEditionInstruction,
  createMetadataInstruction,
} from './helpers/instructions';
import { createMetadata } from './helpers/mint-nft';
import { CreateMasterEditionArgs, CreateMetadataArgs, METADATA_SCHEMA } from './helpers/schema';
import { NftItem, NftItemDocument } from './nft-item.schema';

@Injectable()
export class NftRegisterService {
  constructor(
    @InjectModel(NftItem.name) readonly model: Model<NftItemDocument>,
    readonly gsHelperService: GsHelperService,
    readonly treasuryGetterService: TreasuryGetterService,
    readonly configService: ApiConfigService,
  ) {}

  handleNftRegisterEvent(dto: ITreasuryDepositEventConsumerPayload) {
    return this.model.findOneAndUpdate(
      { address: dto.nftId, userAddress: dto.userAddress, status: { $ne: NftItemStatus.Minted } },
      { status: NftItemStatus.Minted },
      { new: true },
    );
  }

  /*
   * step 1 to registerNft
   */
  async createTxForArweavePayment(
    userAddress: string,
    { gameItemId }: ArweaveUploadPaymentRequest,
  ): Promise<ArweaveUploadPaymentResponse> {
    let nftItem = await this.model.findOne({ gameItemId }).lean({ virtuals: true });
    let needCreateNftItem = !nftItem;

    if (nftItem?.status === NftItemStatus.Minted) {
      throw new BadRequestException('GAME_ITEM_IS_MINTED');
    }

    const gameItem = await this.gsHelperService.validateGameItem(userAddress, gameItemId);

    if (!gameItem) throw new NotFoundException('GAME_ITEM_NOT_FOUND');

    if (nftItem && nftItem.userAddress !== userAddress) {
      await this.model.deleteOne({ gameItemId });
      needCreateNftItem = true;
    }

    const { localImagePath, imageExt } = await this._downloadImageToTmpFolder(
      gameItem.itemImage,
      userAddress,
      gameItemId,
    );

    const imageMimeType = mimeTypes.lookup(imageExt);
    if (!imageMimeType) {
      throw new BadRequestException();
    }

    if (needCreateNftItem)
      nftItem = (
        await this.model.create({
          userAddress,
          gameItemId,
        })
      ).toObject();

    const { gameOwnerKeyPair: owner, provider } = this.treasuryGetterService;

    const metadata: ArweaveMetadata = {
      name: gameItem.itemName,
      symbol: gameItem.itemSymbol,
      image: `0.${imageExt}`,
      properties: {
        files: [
          {
            uri: `0.${imageExt}`,
            type: imageMimeType,
          },
        ],
        category: 'image',
        creators: [
          {
            address: owner.publicKey.toBase58(),
            share: 100,
          },
        ],
      },
      description: '',
      seller_fee_basis_points: 0,
      attributes: [],
      collection: {},
    };

    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    try {
      const fsStat = await fsPromises.stat(localImagePath);
      const estimatedManifestSize = await this._estimateManifestSize([`0.${imageExt}`, 'metadata.json']);
      const storageCost = await this._fetchAssetCostToStore([
        fsStat.size,
        metadataBuffer.length,
        estimatedManifestSize,
      ]);

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(userAddress),
          toPubkey: new PublicKey(this.configService.arweave.paymentWallet),
          lamports: storageCost,
        }),
      );

      transaction.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      transaction.feePayer = new PublicKey(userAddress);

      await this.model.findOneAndUpdate(
        {
          _id: nftItem.id,
        },
        {
          $set: {
            metadata: JSON.stringify(metadata),
            localImagePath,
            gameItemName: gameItem.itemName,
            gameItemImage: gameItem.itemImage,
            status: NftItemStatus.MetadataUploading,
          },
        },
      );

      return {
        serializedTx: transaction.serialize({ verifySignatures: false }).toString('base64'),
        nftItemId: nftItem.id,
        metadata: {
          name: metadata.name,
          image: gameItem.itemImage,
          gameItemId,
          attributes: [],
          description: '',
          royaltiesPercentage: metadata.seller_fee_basis_points,
          costToCreate: storageCost / LAMPORTS_PER_SOL,
        },
      };
    } catch (error) {
      console.error('===== createTxForArweavePayment =====', error);
      await this.model.findByIdAndDelete(nftItem.id);
      throw error;
    } finally {
      fsPromises.rm(localImagePath);
    }
  }

  async treasuryMintNft(userAddress: string, { arweaveUploadTxId, nftItemId }: MintNftItemRequest) {
    const nftItem = await this.model
      .findOne({
        _id: nftItemId,
        userAddress,
      })
      .lean({ virtuals: true });

    if (!nftItem || nftItem.userAddress !== userAddress || nftItem.status !== NftItemStatus.MetadataUploading) {
      throw new NotFoundException('NFT_ITEM_NOT_FOUND');
    }

    if (!nftItem.metadata) {
      throw new BadRequestException('NFT_ITEM_METADATA_NOT_FOUND');
    }

    const { metadataLink } = await this._uploadToArweave(arweaveUploadTxId, nftItem);

    const { serializedTx, nftItemAddress } = await this._treasuryMintNft(new PublicKey(userAddress), metadataLink);

    await this.model.findOneAndUpdate(
      {
        _id: nftItemId,
      },
      { $set: { metadataLink, address: nftItemAddress, status: NftItemStatus.Minting, arweaveUploadTxId } },
    );

    return { serializedTx };
  }

  async _uploadToArweave(arweaveUploadTxId: string, nftItem: NftItem) {
    const imageExt = this._getImageExtension(nftItem.localImagePath);

    const { localImagePath } = await this._downloadImageToTmpFolder(
      nftItem.gameItemImage,
      nftItem.userAddress,
      nftItem.gameItemId,
    );

    const formData = new FormData();
    formData.append('transaction', arweaveUploadTxId);
    formData.append('env', this.configService.blockchain.env);
    formData.append(
      'file[]',
      fs.createReadStream(localImagePath) as any,
      {
        filename: `0.${imageExt}`,
        contentType: mimeTypes.lookup(imageExt),
      } as any,
    );
    formData.append('file[]', Buffer.from(nftItem.metadata) as unknown as any, 'metadata.json');

    const result: { messages: any[]; error: string } = await http.post(
      this.configService.arweave.uploadEndpoint,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    if (result.error) console.error(result.error);

    await fsPromises.rm(localImagePath);

    const metadataFile = result.messages?.find((m) => m.filename === 'manifest.json');
    // const imageFile = result.messages?.find((m) => m.filename === `0.${imageExt}`);

    if (!metadataFile?.transactionId) {
      // @todo improve
      throw new Error('No transaction ID for upload');
    }

    const metadataLink = `https://arweave.net/${metadataFile.transactionId}`;
    // const imageLink = `https://arweave.net/${imageFile.transactionId}?ext=${imageExt.replace('.', '')}`;

    return { metadataLink };
  }

  async _treasuryMintNft(userPublicKey: PublicKey, metadataLink: string, mutableMetadata = true) {
    const {
      connection,
      gameOwnerKeyPair: owner,
      gameId,
      treasuryAccount,
      program: treasuryProgram,
      provider,
    } = this.treasuryGetterService;
    // Retrieve metadata
    const data = await createMetadata(metadataLink);
    if (!data) return null;

    // Allocate memory for the account
    const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);

    // Generate a mint
    const mint = Keypair.generate();
    const instructions: TransactionInstruction[] = [];

    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: userPublicKey,
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    instructions.push(
      Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint.publicKey, 0, owner.publicKey, owner.publicKey),
    );

    const userTokenAccountAddress = await getTokenWallet(userPublicKey, mint.publicKey);
    instructions.push(
      createAssociatedTokenAccountInstruction(userTokenAccountAddress, userPublicKey, userPublicKey, mint.publicKey),
    );

    // Create metadata
    const metadataAccount = await getMetadata(mint.publicKey);
    let txnData = Buffer.from(serialize(METADATA_SCHEMA, new CreateMetadataArgs({ data, isMutable: mutableMetadata })));

    instructions.push(
      createMetadataInstruction(
        metadataAccount,
        mint.publicKey,
        owner.publicKey,
        userPublicKey,
        owner.publicKey,
        txnData,
      ),
    );

    instructions.push(
      Token.createMintToInstruction(TOKEN_PROGRAM_ID, mint.publicKey, userTokenAccountAddress, owner.publicKey, [], 1),
    );

    // Create master edition
    const editionAccount = await getMasterEdition(mint.publicKey);
    txnData = Buffer.from(serialize(METADATA_SCHEMA, new CreateMasterEditionArgs({ maxSupply: new BN(0) })));

    instructions.push(
      createMasterEditionInstruction(
        metadataAccount,
        editionAccount,
        mint.publicKey,
        owner.publicKey,
        userPublicKey,
        owner.publicKey,
        txnData,
      ),
    );

    instructions.push(
      treasuryProgram.instruction.nftRegister(gameId, {
        accounts: {
          owner: owner.publicKey,
          sender: userPublicKey,
          userTokenAccount: userTokenAccountAddress,
          treasuryAccount,
          nft: mint.publicKey,
          systemProgram: SystemProgram.programId,
        },
      }),
    );

    const transaction = new Transaction();
    transaction.add(...instructions);

    transaction.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
    transaction.feePayer = userPublicKey;
    transaction.partialSign(mint, owner);

    return {
      serializedTx: transaction.serialize({ verifySignatures: false }).toString('base64'),
      nftItemAddress: mint.publicKey.toBase58(),
    };
  }

  _downloadImageToTmpFolder(
    imageUrl: string,
    userAddress: string,
    gameItemId: string,
  ): Promise<{ localImagePath: string; imageExt: string }> {
    return new Promise(async (resolve, reject) => {
      const imageExt = this._getImageExtension(imageUrl);

      const response = await http.get<any, Stream>(imageUrl, {
        responseType: 'stream',
      });
      const localImagePath = path.resolve(
        __dirname,
        '../../../files/tmp',
        `${Date.now()}-${userAddress}-${gameItemId}.${imageExt}`,
      );
      const w = response.pipe(fs.createWriteStream(localImagePath));

      w.on('finish', () =>
        resolve({
          localImagePath,
          imageExt,
        }),
      );

      w.on('error', (err) => reject(err));
    });
  }

  async _fetchAssetCostToStore(fileSizes: number[]) {
    console.log(fileSizes);
    const result = await calculate(fileSizes);
    console.log('Arweave cost estimates:', result);

    return result.solana * LAMPORTS_PER_SOL;
  }

  async _estimateManifestSize(filenames: string[]) {
    const paths = {};

    for (const name of filenames) {
      paths[name] = {
        id: 'artestaC_testsEaEmAGFtestEGtestmMGmgMGAV438',
        ext: path.extname(name).replace('.', ''),
      };
    }

    const manifest = {
      manifest: 'arweave/paths',
      version: '0.1.0',
      paths,
      index: {
        path: 'metadata.json',
      },
    };

    const data = Buffer.from(JSON.stringify(manifest), 'utf8');
    console.log('Estimated manifest size:', data.length);
    return data.length;
  }

  _getImageExtension(imageUrl: string) {
    return path.extname(path.basename(imageUrl));
  }
}
