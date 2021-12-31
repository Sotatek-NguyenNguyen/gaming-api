import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './otp.schema';
import { OtpService } from './otp.service';
import { GsOtpController } from './gs-otp.controller';
import { UserModule } from '../user/user.module';
import { GsRequestHistoryModule } from '../gs-request-history/gs-request-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => GsRequestHistoryModule),
  ],
  providers: [OtpService],
  controllers: [GsOtpController],
  exports: [OtpService],
})
export class OtpModule {}
