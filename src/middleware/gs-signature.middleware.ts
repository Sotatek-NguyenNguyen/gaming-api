import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ApiConfigService, GsHelperService } from 'src/modules/shared/services';

@Injectable()
export class GameServerSignatureMiddleware implements NestMiddleware {
  constructor(private readonly gsHelperService: GsHelperService, private readonly configService: ApiConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (['get'].includes(req.method.toLowerCase())) {
      if (req.headers['x-access-key'] !== this.configService.gsKey.accessKey) {
        throw new ForbiddenException();
      }
    } else {
      const signature = req.headers['x-signature'];
      if (!signature || signature !== this.gsHelperService.generateSignature(req.body)) {
        throw new ForbiddenException();
      }
    }

    next();
  }
}
