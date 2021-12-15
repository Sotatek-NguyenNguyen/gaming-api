import { Module } from '@nestjs/common';
import { GsTreasuryController } from './gs-treasury.controller';

@Module({
  controllers: [GsTreasuryController],
})
export class TreasuryModule {}
