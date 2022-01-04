import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ForbiddenException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { generateRandomNumber } from 'src/common/utils';
import nacl from 'tweetnacl';
import { Base58 } from '../auth/base58';
import { UserService } from '../user/user.service';
// import { ListUserQuery, ListUserResponse, UserResponse } from './dto';
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
  async validateOtp(address, dto: any) {
    const { otp, accountInGameId } = dto;
    // var  signedMessage
    // const  expTime= nacl.sign.open( signedMessage ,Base58.decode(address))
    const user = await this.userService.checkUserExistByAddress(address);
    const now = dayjs().format();
    const time = otp.exp;
    const token = await this.getByOtp(otp.address);
    console.log(token);
    if (time < now) throw new RequestTimeoutException();
    if (time > now) {
      if (!token) {
        console.log('success 1');
        await this.model.create({ accountInGameId: accountInGameId, otp: address });
        const userUpdate = await this.userService.updateAccountInGameIdByAddress(address, accountInGameId);
        return userUpdate;
      } else {
        if ((token.accountInGameId = accountInGameId)) {
          console.log('success wwith same otp');
          return { accountInGameId, address };
        } else throw new ForbiddenException();
      }
    }
  }
}
