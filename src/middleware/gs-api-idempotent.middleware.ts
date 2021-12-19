import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { GsHelperService } from 'src/modules/shared/services';

@Injectable()
export class GameServerApiIdempotentMiddleware implements NestMiddleware {
  constructor(@InjectRedis() private readonly redis: Redis, private readonly gsHelperService: GsHelperService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.body?.requestId;

    if (requestId) {
      const cached = await this.redis.get(this.gsHelperService.genRedisRequestIdKey(requestId));

      if (cached) {
        const { statusResponse, dataResponse } = JSON.parse(cached);

        return res.status(statusResponse).json(dataResponse).end();
      }
    }

    next();
  }
}
