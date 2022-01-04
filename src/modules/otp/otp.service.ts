import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ForbiddenException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { generateRandomNumber } from 'src/common/utils';
import nacl from 'tweetnacl';
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
  async validateOtp(dto: any) {
    const otp = dto.otp;
    const accountInGameId = dto.accountInGameId;
    const user = await this.userService.getUserByAddress(otp.address);
    const address = otp.address;
    const now = dayjs().format();
    const time = otp.exp;
    const token = await this.getByOtp(otp.address);
    console.log(token);
    if (time < now) throw new RequestTimeoutException();
    if (time > now) {
      if (!token) {
        console.log('success 1');
        const token2 = await this.model.create({ accountInGameId: accountInGameId, otp: address });
        return { accountInGameId, address };
      } else {
        if ((token.accountInGameId = accountInGameId)) {
          console.log('success wwith same otp');
          return { accountInGameId, address };
        } else throw new ForbiddenException();
      }
    }
  }
}
