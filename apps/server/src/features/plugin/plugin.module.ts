import { forwardRef, Module } from "@nestjs/common";
import { DrizzleModule } from "drizzle/provider";
import { EnvironmentModule } from "environment/environment.module";
import { ChatModule } from "features/chat/chat.module";
import { FileSystemModule } from "features/file-system/file-system.module";
import { PluginConfigModule } from "features/plugin-config/plugin-config.module";
import { PluginController } from "features/plugin/plugin.controller";
import { PluginRepository } from "features/plugin/plugin.repository";
import { PluginService } from "features/plugin/plugin.service";
import { RegistryModule } from "integrations/registry/registry.module";

@Module({
  imports: [
    DrizzleModule,
    EnvironmentModule,
    ChatModule,
    FileSystemModule,
    RegistryModule,
    forwardRef(() => PluginConfigModule),
  ],
  controllers: [PluginController],
  providers: [PluginService, PluginRepository],
  exports: [PluginService],
})
export class PluginModule {}
