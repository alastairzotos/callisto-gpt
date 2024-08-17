import { Module } from '@nestjs/common';
import { ChatModule } from './features/chat/chat.module';
import { PluginModule } from 'features/plugin/plugin.module';
import { FileSystemModule } from 'features/file-system/file-system.module';
import { RegistryModule } from 'integrations/registry/registry.module';
import { CryptoModule } from 'features/crypto/crypto.module';
import { HealthModule } from 'features/health/health.module';
import { DrizzleModule } from 'drizzle/provider';
import { PluginConfigModule } from 'features/plugin-config/plugin-config.module';

@Module({
  imports: [
    HealthModule,
    DrizzleModule,
    ChatModule,
    PluginModule,
    FileSystemModule,
    PluginConfigModule,
    RegistryModule,
    CryptoModule,
  ],
})
export class AppModule {}
