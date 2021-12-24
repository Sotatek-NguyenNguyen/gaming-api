import { Module } from '@nestjs/common';
import { GsTreasuryController } from './gs-treasury.controller';
import { TreasuryService } from './treasury.service';

@Module({
  providers: [TreasuryService],
  controllers: [GsTreasuryController],
})
export class TreasuryModule {}
