import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cluster from 'cluster';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  private getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get(key, defaultValue);
    if (value === undefined) {
      throw new Error(key + ' env var not set'); // probably we should call process.exit() too to avoid locking the service
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' env var is not a number');
    }
  }

  private getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.configService.get(key, defaultValue?.toString());
    if (value === undefined) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get(key, defaultValue);

    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    return value.toString().replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV', 'development');
  }

  get mongoConfig() {
    return {
      uri: this.getString('MONGODB_URI'),
    };
  }

  get awsS3Config() {
    return {
      accessKeyId: this.getString('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.getString('AWS_SECRET_ACCESS_KEY'),
      region: this.getString('AWS_DEFAULT_REGION'),
      endpoint: this.getString('AWS_S3_ENDPOINT'),
      bucketName: this.getString('AWS_S3_BUCKET'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION', !this.isProduction);
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get adminToken() {
    return this.getString('ADMIN_TOKEN');
  }

  get isMasterProcess() {
    return cluster.isPrimary || +process.env.NODE_APP_INSTANCE === 0 || cluster.isMaster;
  }

  get redisConfig() {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      database: this.getNumber('REDIS_DB'),
    };
  }

  get jwtSecret() {
    return this.getString('JWT_SECRET');
  }

  // Game server key
  get gsKey() {
    return {
      accessKey: this.getString('GS_ACCESS_KEY'),
      secretKey: this.getString('GS_SECRET_KEY'),
    };
  }

  get blockchain() {
    return {
      rpcEndpoint: this.getString('BC_RPC_ENDPOINT'),
      env: this.getString('BC_ENV'),
      programId: this.getString('TREASURY_PROGRAM_ID'),
      treasuryAccount: this.getString('TREASURY_ACCOUNT'),
      gameId: this.getString('TREASURY_GAME_ID'),
      gameOwnerPK: this.getString('TREASURY_GAME_OWNER_PRIVATE_KEY'),
      pdaSeed: this.getString('TREASURY_PDA_SEED'),
    };
  }

  get arweave() {
    return {
      paymentWallet: this.getString('ARWEAVE_PAYMENT_WALLET'),
      uploadEndpoint: this.getString('ARWEAVE_UPLOAD_ENDPOINT'),
    };
  }

  get mintToken() {
    return {
      name: this.getString('MINT_TOKEN_NAME'),
      symbol: this.getString('MINT_TOKEN_SYMBOL'),
      address: this.getString('MINT_TOKEN_ADDRESS'),
    };
  }
}
