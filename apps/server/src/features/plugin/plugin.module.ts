import { Module } from "@nestjs/common";
import { EnvironmentModule } from "environment/environment.module";
import { ChatModule } from "features/chat/chat.module";
import { PluginController } from "features/plugin/plugin.controller";
import { PluginService } from "features/plugin/plugin.service";

@Module({
  imports: [
    EnvironmentModule,
    ChatModule,
  ],
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginModule {}
