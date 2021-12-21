import { Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { NftItemResponse } from './dto/nft-item.response.dto';
import { NftItem } from './nft-item.schema';

@Injectable()
export class NftMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper: Mapper) => {
      mapper.createMap(NftItem, NftItemResponse);
    };
  }
}
