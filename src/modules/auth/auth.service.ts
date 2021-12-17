import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../shared/services';
import { UserService } from '../user/user.service';
import { GetSignatureMsgToLoginRequest, LoginRequest } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly configService: ApiConfigService) {}

  async getSignatureMessageToLogin({ address }: GetSignatureMsgToLoginRequest) {
    const nonce = await this.userService.getNonceByAddress(address);

    return { signatureMsg: `Please confirm to login: #${nonce}` };
  }

  async userLogin(dto: LoginRequest) {
    // validate signature
    // validate user exists of not
    // const admin = await
    // generate auth token and return

    return dto;
  }

  async adminLogin(dto: LoginRequest) {
    // validate signature

    // validate user is admin or not
    // const admin = await this.userService.isAdmin(address);
    // generate auth token and return

    return dto;
  }
}
