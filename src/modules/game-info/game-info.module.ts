import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminGameInfoController } from './admin-game-info.controller';
import { GameInfoController } from './game-info.controller';
import { GameInfoMapper } from './game-info.mapper';
import { GameInfo, GameInfoSchema } from './game-info.schema';
import { GameInfoService } from './game-info.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: GameInfo.name, schema: GameInfoSchema }])],
  providers: [GameInfoService, GameInfoMapper],
  controllers: [AdminGameInfoController, GameInfoController],
})
export class GameInfoModule {}
