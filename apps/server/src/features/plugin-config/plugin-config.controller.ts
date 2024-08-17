import { Body, Controller, Param, Post } from "@nestjs/common";
import { PluginConfigService } from "features/plugin-config/plugin-config.service";
import { PluginConfig } from "types/plugin-configs";

@Controller('plugin-config')
export class PluginConfigController {
  constructor(
    private readonly pluginConfigsService: PluginConfigService,
  ) {}

  @Post('config/:pluginName')
  async setPluginConfig(
    @Param('pluginName') pluginName: string,
    @Body() config: PluginConfig,
  ) {
    await this.pluginConfigsService.setPluginConfig(pluginName, config);
  }
}
