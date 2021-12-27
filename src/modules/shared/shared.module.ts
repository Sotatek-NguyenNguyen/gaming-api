import { Global, Module } from '@nestjs/common';
import { ApiConfigService, GsHelperService, TreasuryGetterService } from './services';

@Global()
@Module({
  imports: [],
  providers: [ApiConfigService, GsHelperService, TreasuryGetterService],
  exports: [ApiConfigService, GsHelperService, TreasuryGetterService],
})
export class SharedModule {}
