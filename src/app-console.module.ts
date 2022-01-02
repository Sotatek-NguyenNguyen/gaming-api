import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { NftItemModule } from './modules/nft-item/nft-item.module';
import { ApiConfigService } from './modules/shared/services';
import { SharedModule } from './modules/shared/shared.module';
import { TreasuryEventModule } from './modules/treasury-event/treasury-event.module';

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
    RedisModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        config: configService.redisConfig,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        redis: configService.redisConfig,
        prefix: 'gaming',
      }),
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    SharedModule,
    ConsoleModule,
    TreasuryEventModule,
    NftItemModule,
  ],
})
export class AppConsoleModule {}
