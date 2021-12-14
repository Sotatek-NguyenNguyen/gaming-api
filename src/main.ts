import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiConfigService } from './shared/services';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { MongoServerErrorFilter } from './filters/mongo-error-exception.filter';
import { setupSwagger } from './swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalFilters(new MongoServerErrorFilter());

  const apiConfigService = app.get(ApiConfigService);

  if (apiConfigService.documentationEnabled) {
    setupSwagger(app);
  }

  await app.listen(apiConfigService.appConfig.port);
}
bootstrap();
