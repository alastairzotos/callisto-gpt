import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PluginService } from 'features/plugin/plugin.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.get(PluginService).startPlugins();

  await app.listen(6000);
}

bootstrap();
