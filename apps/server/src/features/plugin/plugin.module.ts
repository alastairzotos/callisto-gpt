import { forwardRef, Module } from "@nestjs/common";
import { EnvironmentModule } from "environment/environment.module";
import { ChatModule } from "features/chat/chat.module";
import { FileSystemModule } from "features/file-system/file-system.module";
import { PluginConfigsModule } from "features/plugin-configs/plugin-configs.module";
import { PluginController } from "features/plugin/plugin.controller";
import { PluginService } from "features/plugin/plugin.service";

@Module({
  imports: [
    EnvironmentModule,
    ChatModule,
    FileSystemModule,
    forwardRef(() => PluginConfigsModule),
  ],
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginModule {}
