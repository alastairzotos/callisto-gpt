import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EnvironmentService } from "environment/environment.service";
import { FileSystemService } from "features/file-system/file-system.service";
import { PluginService } from "features/plugin/plugin.service";
import * as path from 'path';
import { PluginConfig } from "types/plugin-configs";

@Injectable()
export class PluginConfigsService {
  constructor(
    private readonly envService: EnvironmentService,
    private readonly fsService: FileSystemService,
    @Inject(forwardRef(() => PluginService))
    private readonly pluginService: PluginService,
  ) {}

  async setPluginConfig(pluginName: string, config: PluginConfig) {
    await this.fsService.writeFile(
      await this.getPluginConfigPath(pluginName),
      Object.entries(config).map(([key, value]) => `${key}=${value}`).join('\n')
    );

    await this.pluginService.restartPlugin(pluginName);
  }

  async loadPluginConfig(pluginName: string): Promise<PluginConfig> {
    if (!await this.fsService.exists(await this.getPluginConfigPath(pluginName))) {
      return {};
    }

    const content = await this.fsService.readFile(await this.getPluginConfigPath(pluginName));

    return content.split('\n')
      .map(line => line.split('='))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as PluginConfig)
  }

  private async getPluginConfigsPath() {
    return await this.fsService.getOrCreateDir(path.resolve(process.cwd(), 'plugin-configs'));
  }

  private async getPluginConfigPath(pluginName: string) {
    return path.resolve(await this.getPluginConfigsPath(), `.env.${pluginName}`);
  }
}
