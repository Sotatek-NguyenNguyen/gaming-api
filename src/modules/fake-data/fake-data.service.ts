import { Injectable } from '@nestjs/common';
import faker from 'faker';
import { AnyKeys } from 'mongoose';
import { BalanceChangeType } from '../balance-change/balance-change.enum';
import { BalanceChange } from '../balance-change/balance-change.schema';
import { BalanceChangeService } from '../balance-change/balance-change.service';
import { NftItem } from '../nft-item/nft-item.schema';
import { NftItemService } from '../nft-item/nft-item.service';
import { UserService } from '../user/user.service';

@Injectable()
export class FakeDataService {
  constructor(
    readonly bcService: BalanceChangeService,
    readonly nftService: NftItemService,
    readonly userService: UserService,
  ) {}

  async fake(userAddress: string) {
    await this.userService.checkUserExistByAddress(userAddress);

    const bcEntities: AnyKeys<BalanceChange>[] = [];
    const nftEntities: AnyKeys<NftItem>[] = [];

    for (let i = 0; i < 30; i++) {
      bcEntities.push({
        amount: faker.datatype.number(30),
        userAddress,
        type: faker.helpers.randomize(Object.values(BalanceChangeType)),
        transactionId: faker.finance.ethereumAddress(),
      });

      nftEntities.push({
        referenceId: faker.datatype.uuid(),
        userAddress,
        address: faker.finance.ethereumAddress(),
      });
    }

    await Promise.all([this.bcService.insertMany(bcEntities), this.nftService.insertMany(nftEntities)]);

    return { success: true };
  }
}
