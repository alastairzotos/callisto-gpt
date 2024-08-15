import { Controller, Param, Post } from "@nestjs/common";
import { PluginService } from "features/plugin/plugin.service";

@Controller('plugin')
export class PluginController {
  constructor(
    private readonly pluginService: PluginService,
  ) {}

  @Post('install/:name')
  async installPlugin(
    @Param('name') name: string
  ) {
    await this.pluginService.installPlugin(name);
  }
}
