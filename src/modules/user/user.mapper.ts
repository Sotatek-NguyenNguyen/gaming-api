import { mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Decimal128 } from 'mongodb';
import { UserResponse } from './dto';
import { User } from './user.schema';

@Injectable()
export class UserMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(User, UserResponse).forMember(
        (d) => d.balance,
        mapFrom((s) => ((s.balance as any) instanceof Decimal128 ? +s.balance.toString() : s.balance)),
      );
    };
  }
}
