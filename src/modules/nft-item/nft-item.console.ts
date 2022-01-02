import { Command, Console } from 'nestjs-console';
import { NftItemService } from './nft-item.service';

@Console()
export class NftItemConsole {
  constructor(readonly nftItemService: NftItemService) {}

  @Command({
    command: 'nft-item-scan',
    description: 'NFT Item Scanner',
  })
  treasuryNftScan() {
    return this.nftItemService.nftItemScan();
  }
}
