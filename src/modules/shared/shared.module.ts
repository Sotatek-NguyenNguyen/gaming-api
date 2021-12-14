import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services';

@Global()
@Module({
  imports: [],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class SharedModule {}
