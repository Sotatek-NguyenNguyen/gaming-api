import { CacheModule, forwardRef, Global, Module } from '@nestjs/common';
import { TasksModule } from 'src/modules/tasks/task.module';
import { ApiConfigService, AwsS3Service } from './services';
import { RedisKeyGeneratorService } from './services/redis-key-generator.service';
import { SocketGateway } from './services/socket';
import { MessageSocketsHandler } from './services/socket/message.socket.handler';

@Global()
@Module({
  imports: [CacheModule.register(), forwardRef(() => TasksModule)],
  providers: [ApiConfigService, AwsS3Service, SocketGateway, MessageSocketsHandler, RedisKeyGeneratorService],
  exports: [CacheModule, ApiConfigService, AwsS3Service, SocketGateway, RedisKeyGeneratorService],
})
export class SharedModule {}
