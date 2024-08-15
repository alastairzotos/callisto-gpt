import { forwardRef, Module } from "@nestjs/common";
import { EnvironmentModule } from "environment/environment.module";
import { CryptoModule } from "features/crypto/crypto.module";
import { FileSystemModule } from "features/file-system/file-system.module";
import { PluginConfigsController } from "features/plugin-configs/plugin-configs.controller";
import { PluginConfigsService } from "features/plugin-configs/plugin-configs.service";
import { PluginModule } from "features/plugin/plugin.module";

@Module({
  imports: [
    EnvironmentModule,
    FileSystemModule,
    CryptoModule,
    
    forwardRef(() => PluginModule),
  ],
  controllers: [PluginConfigsController],
  providers: [PluginConfigsService],
  exports: [PluginConfigsService],
})
export class PluginConfigsModule {}
