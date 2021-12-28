import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/modules/shared/services';
import { IJwtPayload } from 'src/common/interfaces';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ApiConfigService, readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    await this.userService.checkUserExistByAddress(payload.address);

    return { userId: payload.sub, address: payload.address, role: payload.role };
  }
}
