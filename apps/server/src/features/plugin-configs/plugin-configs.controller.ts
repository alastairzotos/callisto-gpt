import { Body, Controller, Param, Post } from "@nestjs/common";
import { PluginConfigsService } from "features/plugin-configs/plugin-configs.service";
import { PluginConfig } from "types/plugin-configs";

@Controller('plugin-configs')
export class PluginConfigsController {
  constructor(
    private readonly pluginConfigsService: PluginConfigsService,
  ) {}

  @Post('config/:pluginName')
  async setPluginConfig(
    @Param('pluginName') pluginName: string,
    @Body() config: PluginConfig,
  ) {
    await this.pluginConfigsService.setPluginConfig(pluginName, config);
  }
}
