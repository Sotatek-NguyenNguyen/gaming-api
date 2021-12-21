import { Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { NftItem } from './nft-item.schema';
import { ListNftResponse } from './dto';
import { NftItemResponse } from './dto/nft-item.response.dto';

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
