import { Module } from '@nestjs/common';
import { AdminGameInfoController } from './admin-game-info.controller';
import { GameInfoController } from './game-info.controller';

@Module({
  controllers: [AdminGameInfoController, GameInfoController],
})
export class GameInfoModule {}
