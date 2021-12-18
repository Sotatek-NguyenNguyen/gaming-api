import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class GameServerAuth implements CanActivate {
  constructor(readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    if (req.method.toLowerCase() === 'get') {
      //
    }
    // const { 'x-api-key': apiClientId, signature } = req.headers;
    // const { body } = req;

    // const hmac;

    return true;
  }
}
