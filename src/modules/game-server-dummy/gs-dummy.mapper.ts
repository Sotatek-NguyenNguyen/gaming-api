import { Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { GsGameItemResponse } from './dto';
import { PlayerResponse } from './dto/gsd-player.dto';
import { GsGameItem, GsPlayer } from './schema';

@Injectable()
export class GameServerDummyMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(GsPlayer, PlayerResponse);
      mapper.createMap(GsGameItem, GsGameItemResponse);
    };
  }
}
