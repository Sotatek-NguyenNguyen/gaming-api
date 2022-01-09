import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Redis } from 'ioredis';
import { stringify } from 'querystring';
import { GameServerUrlRedisKey } from 'src/common/constant';
import { http } from 'src/common/http';
import { GsdValidateGameItemRequest, GsdValidateGameItemResponse } from 'src/modules/game-server-dummy/dto';
import { GsNotifyConsumerPayload } from 'src/modules/treasury-event-consumer/interfaces';
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

  async notifyGs(dto: GsNotifyConsumerPayload) {
    const signature = this.generateSignature(dto);
    const gsWebhookUrl = await this.redis.get(GameServerUrlRedisKey.Webhook);

    if (!gsWebhookUrl) {
      throw new Error('GAME_SERVER_WEBHOOK_IS_NOT_SET');
    }

    const { event, data } = dto;

    return http.post(
      gsWebhookUrl,
      { event, data },
      {
        headers: {
          'x-signature': signature,
        },
      },
    );
  }

  async validateGameItem(userAddress: string, itemId: string): Promise<GsdValidateGameItemResponse> {
    const getItemUrl = await this.redis.get(GameServerUrlRedisKey.GetItemUrl);

    if (!getItemUrl) {
      throw new BadRequestException('MINT_NFT_IS_NOT_AVAILABLE');
    }

    return http.post<any, GsdValidateGameItemResponse, GsdValidateGameItemRequest>(
      getItemUrl,
      {
        itemId,
        userAddress,
      },
      {
        headers: { 'x-access-key': this.configService.gsKey.accessKey },
      },
    );
  }
}
