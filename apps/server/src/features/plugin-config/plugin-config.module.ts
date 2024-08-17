import { forwardRef, Module } from "@nestjs/common";
import { DrizzleModule } from "drizzle/provider";
import { EnvironmentModule } from "environment/environment.module";
import { CryptoModule } from "features/crypto/crypto.module";
import { PluginConfigController } from "features/plugin-config/plugin-config.controller";
import { PluginConfigRepository } from "features/plugin-config/plugin-config.repository";
import { PluginConfigService } from "features/plugin-config/plugin-config.service";
import { PluginModule } from "features/plugin/plugin.module";

@Module({
  imports: [
    EnvironmentModule,
    DrizzleModule,
    CryptoModule,
    
    forwardRef(() => PluginModule),
  ],
  controllers: [PluginConfigController],
  providers: [PluginConfigService, PluginConfigRepository],
  exports: [PluginConfigService, PluginConfigRepository],
})
export class PluginConfigModule {}
