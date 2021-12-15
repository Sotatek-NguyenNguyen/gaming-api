import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiConfigService } from '../shared/services';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    readonly configService: ApiConfigService,
    @InjectMapper() readonly mapper: Mapper,
  ) {}
}
