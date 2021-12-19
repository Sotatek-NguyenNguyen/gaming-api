import { Global, Module } from '@nestjs/common';
import { ApiConfigService, GsHelperService } from './services';

@Global()
@Module({
  imports: [],
  providers: [ApiConfigService, GsHelperService],
  exports: [ApiConfigService, GsHelperService],
})
export class SharedModule {}
