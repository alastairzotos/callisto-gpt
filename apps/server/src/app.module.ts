import { Module } from '@nestjs/common';
import { ChatModule } from './features/chat/chat.module';
import { PluginModule } from 'features/plugin/plugin.module';

@Module({
  imports: [
    ChatModule,
    PluginModule,
  ],
})
export class AppModule {}
