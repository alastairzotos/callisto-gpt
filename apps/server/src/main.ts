import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PluginService } from 'features/plugin/plugin.service';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableCors();

  await app.get(PluginService).startPlugins();

  await app.listen(6000);
}

bootstrap();
