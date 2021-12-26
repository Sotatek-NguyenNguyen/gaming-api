import { Command, Console } from 'nestjs-console';
import { TreasuryEventService } from './treasury-event.service';
import { TreasurySignatureService } from './treasury-signature.service';

@Console()
export class TreasuryEventConsole {
  constructor(
    private treasuryEventService: TreasuryEventService,
    private readonly treasurySignatureService: TreasurySignatureService,
  ) {}

  @Command({
    command: 'treasury-event',
    description: 'Treasury event parser',
  })
  treasuryEvent() {
    return this.treasuryEventService.treasuryEvent();
  }

  @Command({
    command: 'treasury-signature',
    description: 'Treasury signature crawler',
  })
  treasurySignature() {
    return this.treasurySignatureService.crawl();
  }
}
