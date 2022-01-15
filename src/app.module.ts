import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GameServerApiIdempotentMiddleware, GameServerSignatureMiddleware } from './middleware';
import { AuthModule } from './modules/auth/auth.module';
import { BalanceChangeModule } from './modules/balance-change/balance-change.module';
import { GameInfoModule } from './modules/game-info/game-info.module';
import { GameServerDummyModule } from './modules/game-server-dummy/gs-dummy.module';
import { GsRequestHistoryModule } from './modules/gs-request-history/gs-request-history.module';
import { NftItemModule } from './modules/nft-item/nft-item.module';
import { OtpModule } from './modules/otp/otp.module';
import { ApiConfigService } from './modules/shared/services';
import { SharedModule } from './modules/shared/shared.module';
import { TreasuryEventConsumerModule } from './modules/treasury-event-consumer/treasury-event-consumer.module';
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
    SharedModule,
    UserModule,
    BalanceChangeModule,
    NftItemModule,
    GameInfoModule,
    TreasuryModule,
    AuthModule,
    GsRequestHistoryModule,
    TreasuryEventConsumerModule,
    OtpModule,
    ScheduleModule.forRoot(),
    process.env.NODE_ENV !== 'production' && GameServerDummyModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GameServerSignatureMiddleware, GameServerApiIdempotentMiddleware).forRoutes('game-server');
  }
}
