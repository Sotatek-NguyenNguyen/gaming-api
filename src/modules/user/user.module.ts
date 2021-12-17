import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserController } from './admin-user.controller';
import { MyBalanceController } from './current-user.controller';
import { GsBalanceController } from './gs-user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  controllers: [MyBalanceController, AdminUserController, GsBalanceController],
  exports: [UserService],
})
export class UserModule {}
