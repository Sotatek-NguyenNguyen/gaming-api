import { Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AdminGetGameInfoResponse, GameInfoBaseResponse } from './dto';
import { GameInfo } from './game-info.schema';

@Injectable()
export class GameInfoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(GameInfo, AdminGetGameInfoResponse);
      mapper.createMap(GameInfo, GameInfoBaseResponse);
    };
  }
}
