import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import nacl from 'tweetnacl';
import { Base58 } from '../auth/base58';
import { UserService } from '../user/user.service';
import { OtpRequest } from './dto/otp.request.dto';
import * as bs58 from 'bs58';
import { Otp, OtpDocument } from './otp.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) readonly model: Model<OtpDocument>,
    private readonly userService: UserService,
    @InjectMapper() readonly mapper: Mapper,
  ) {}

  getByOtp(otp: string) {
    return this.model.findOne({ otp }).lean({ virtuals: true });
  }

  async validateOtp(dto: OtpRequest) {
    const { otp, accountInGameId } = dto;
    const data = JSON.parse(bs58.decode(otp).toString());
    const signature = data?.signature;
    const address = data?.address;

    const message = {
      address: data.address,
      exp: data.exp,
    };

    const validate = nacl.sign.detached.verify(
      Buffer.from(JSON.stringify(message)),
      Buffer.from(signature, 'hex'),
      Base58.decode(address),
    );

    if (!validate) throw new BadRequestException('SIGNATURE_IS_NOT_VALID');

    const now = new Date().getTime();
    const user = await this.userService.checkUserExistByAddress(address);

    if (data.exp < now) throw new BadRequestException('EXPIRE_TIME_OUT');

    if (data.exp > now) {
      const token = await this.getByOtp(otp);
      if (!token) {
        const isAccountInGameIdWasUsed = await this.userService.getUserByAccountInGameId(accountInGameId);

        if (isAccountInGameIdWasUsed && isAccountInGameIdWasUsed.address !== address)
          throw new ForbiddenException('THIS_ACCOUNT_IN_GAME_IS_USED_WITH_ANOTHER_ADDRESS');

        await this.model.create({ accountInGameId: accountInGameId, otp: otp });

        return this.userService.updateAccountInGameIdByAddress(address, accountInGameId);
      } else {
        if (token.accountInGameId === accountInGameId) {
          return user;
        } else throw new ForbiddenException('THIS_OTP_WAS_USED_WITH_ANOTHER_ACOUNT');
      }
    }
  }
}
