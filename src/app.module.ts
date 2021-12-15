import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceChangeModule } from './modules/balance-change/balance-change.module';
import { GameInfoModule } from './modules/game-info/game-info.module';
import { NftItemModule } from './modules/nft-item/nft-item.module';
import { ApiConfigService } from './modules/shared/services';
import { SharedModule } from './modules/shared/shared.module';
import { TreasuryModule } from './modules/treasury/treasury.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory(configService: ApiConfigService) {
        return configService.mongoConfig;
      },
      inject: [ApiConfigService],
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    SharedModule,
    UserModule,
    BalanceChangeModule,
    NftItemModule,
    GameInfoModule,
    TreasuryModule,
  ],
})
export class AppModule {}
