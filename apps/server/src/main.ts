import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PluginService } from 'features/plugin/plugin.service';
import { RequestMethod } from '@nestjs/common';
import { environment } from 'environment/environment';
import * as ngrok from 'ngrok';
import * as qrcode from 'qrcode-terminal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });

  app.enableCors();

  await app.get(PluginService).startPlugins();

  await app.listen(7000);

  const url = await ngrok.connect(7000);

  console.log(`URL: ${url}`);

  qrcode.generate(`${environment.clientUrl}?server=${url}`, { small: true });
}

bootstrap();
