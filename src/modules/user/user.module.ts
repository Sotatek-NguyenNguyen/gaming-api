import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { AdminGameBalanceController } from './admin-game-balance.controller';
import { AdminUserController } from './admin-user.controller';
import { MyBalanceController } from './current-user.controller';
import { GsBalanceController } from './gs-user.controller';
import { UserMapper } from './user.mapper';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => BalanceChangeModule),
  ],
  providers: [UserService, UserMapper],
  controllers: [MyBalanceController, AdminUserController, GsBalanceController, AdminGameBalanceController],
  exports: [UserService],
})
export class UserModule {}
