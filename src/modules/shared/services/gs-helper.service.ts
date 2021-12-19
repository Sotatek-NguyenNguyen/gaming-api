import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Redis } from 'ioredis';
import { stringify } from 'querystring';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class GsHelperService {
  constructor(private configService: ApiConfigService, @InjectRedis() private readonly redis: Redis) {}

  // generate signature to communicate with game server
  generateSignature(data: Record<string, any>) {
    const { accessKey, secretKey } = this.configService.gsKey;
    const signData = `accessKey=${accessKey}&${stringify(data)}`;
    const hmac = createHmac('sha512', secretKey);

    return hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  }

  genRedisRequestIdKey(requestId: string) {
    return `gs-request-${requestId}`;
  }

  saveRequestDataToRedis({
    requestId,
    statusResponse,
    dataResponse,
  }: {
    requestId: string;
    statusResponse: number;
    dataResponse: any;
  }) {
    return this.redis.set(
      this.genRedisRequestIdKey(requestId),
      JSON.stringify({ statusResponse, dataResponse }),
      'EX',
      120,
    );
  }
}
