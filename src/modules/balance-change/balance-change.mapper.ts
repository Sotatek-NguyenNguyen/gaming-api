import { Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { BalanceChange } from './balance-change.schema';
import { BalanceChangesResponse } from './dto';

@Injectable()
export class BalanceChangeMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(BalanceChange, BalanceChangesResponse);
    };
  }
}
