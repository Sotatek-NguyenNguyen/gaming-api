import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger-setup';
import { ApiConfigService } from './modules/shared/services';
import { MongoServerErrorFilter, AllExceptionsFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalFilters(new MongoServerErrorFilter(), new AllExceptionsFilter());

  const apiConfigService = app.get(ApiConfigService);

  if (apiConfigService.documentationEnabled) {
    setupSwagger(app);
  }

  await app.listen(apiConfigService.appConfig.port);
}
bootstrap();
