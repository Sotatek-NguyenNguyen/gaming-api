import { NftMapper } from './nft.mapper';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminNftItemController } from './admin-nft-item.controller';
import { GsNftItemController } from './gs-nft-item.controller';
import { MyNftItemController } from './my-nft-item.controller';
import { NftItem, NftItemSchema } from './nft-item.schema';
import { NftItemService } from './nft-item.service';
import { NftItemConsole } from './nft-item.console';

@Module({
  imports: [MongooseModule.forFeature([{ name: NftItem.name, schema: NftItemSchema }])],
  providers: [NftItemService, NftMapper, NftItemConsole],
  controllers: [MyNftItemController, AdminNftItemController, GsNftItemController],
  exports: [NftItemService],
})
export class NftItemModule {}
