import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { NftItemConsoleModule } from './modules/nft-item/nft-item-console.module';
import { ApiConfigService } from './modules/shared/services';
import { SharedModule } from './modules/shared/shared.module';

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
    NftItemConsoleModule,
  ],
})
export class AppNftScanConsoleModule {}
