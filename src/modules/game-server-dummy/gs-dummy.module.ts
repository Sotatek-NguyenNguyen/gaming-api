import { Module } from '@nestjs/common';
import { GameServerDummyController } from './gs-dummy.controller';

@Module({
  imports: [],
  controllers: [GameServerDummyController],
})
export class GameServerDummyModule {}
