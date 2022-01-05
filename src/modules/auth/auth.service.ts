import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/common/interfaces';
import nacl from 'tweetnacl';
import { UserService } from '../user/user.service';
import { Base58 } from './base58';
import { GenerateAuthTokenTestingRequest, GetSignatureMsgToLoginRequest, LoginRequest, LoginResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, readonly jwtService: JwtService) {}

  async getSignatureMessageToLogin({ address }: GetSignatureMsgToLoginRequest) {
    let user = await this.userService.getUserByAddress(address);

    if (!user) {
      user = await this.userService.create({
        address,
      });
    }

    return { signatureMsg: this.generateSignatureMsgFromNonce(user.nonce) };
  }

  async userLogin(dto: LoginRequest): Promise<LoginResponse> {
    const { address, signature } = dto;

    const user = await this.userService.checkUserExistByAddress(address);

    this.validateSignature({ nonce: user.nonce, signature, address });

    await this.userService.generateNewNonce(user.id);

    return { accessToken: this.generateAuthToken({ address, role: user.role, userId: user.id }) };
  }

  async adminLogin(dto: LoginRequest): Promise<LoginResponse> {
    const { address, signature } = dto;

    const user = await this.userService.isAdmin(address);

    this.validateSignature({ nonce: user.nonce, signature, address });

    await this.userService.generateNewNonce(user.id);

    return { accessToken: this.generateAuthToken({ address, role: user.role, userId: user.id }) };
  }

  validateSignature({ nonce, signature, address }: { nonce: number; signature: Uint8Array; address: string }) {
    const isValidSignature = nacl.sign.detached.verify(
      new TextEncoder().encode(this.generateSignatureMsgFromNonce(nonce)),
      Buffer.from(signature),
      Base58.decode(address),
    );

    if (!isValidSignature) {
      throw new BadRequestException('SIGNATURE_IS_NOT_VALID');
    }
  }

  generateAuthToken(dto: GenerateAuthTokenTestingRequest) {
    return this.jwtService.sign(<IJwtPayload>{ sub: dto.userId, address: dto.address, role: dto.role });
  }

  generateSignatureMsgFromNonce(nonce: number) {
    return `Please confirm to login: #${nonce}`;
  }
}
