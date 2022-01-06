import dotenv from 'dotenv';
dotenv.config();
import { BootstrapConsole } from 'nestjs-console';
import { AppConsoleModule } from './app-console.module';

const bootstrap = new BootstrapConsole({
  module: AppConsoleModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
