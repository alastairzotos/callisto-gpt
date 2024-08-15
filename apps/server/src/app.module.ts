import { Module } from '@nestjs/common';
import { ChatModule } from './features/chat/chat.module';
import { PluginModule } from 'features/plugin/plugin.module';
import { PluginConfigsModule } from 'features/plugin-configs/plugin-configs.module';
import { FileSystemModule } from 'features/file-system/file-system.module';
import { RegistryModule } from 'integrations/registry/registry.module';
import { CryptoModule } from 'features/crypto/crypto.module';

@Module({
  imports: [
    ChatModule,
    PluginModule,
    FileSystemModule,
    PluginConfigsModule,
    RegistryModule,
    CryptoModule,
  ],
})
export class AppModule {}
