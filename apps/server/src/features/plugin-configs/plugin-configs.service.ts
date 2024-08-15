import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CryptoService } from "features/crypto/crypto.service";
import { FileSystemService } from "features/file-system/file-system.service";
import { PluginService } from "features/plugin/plugin.service";
import * as path from 'path';
import { PluginConfig } from "types/plugin-configs";

@Injectable()
export class PluginConfigsService {
  constructor(
    private readonly fsService: FileSystemService,
    private readonly cryptoService: CryptoService,

    @Inject(forwardRef(() => PluginService))
    private readonly pluginService: PluginService,
  ) {}

  async setPluginConfig(pluginName: string, config: PluginConfig) {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(config)) {
      lines.push(`${key}=${await this.cryptoService.encrypt(value)}`);
    }

    await this.fsService.writeFile(await this.getPluginConfigPath(pluginName), lines.join('\n'));

    await this.pluginService.restartPlugin(pluginName);
  }

  async loadPluginConfig(pluginName: string): Promise<PluginConfig> {
    if (!await this.fsService.exists(await this.getPluginConfigPath(pluginName))) {
      return {};
    }

    const content = await this.fsService.readFile(await this.getPluginConfigPath(pluginName));

    const parts = content.split('\n').map(line => line.split('='));

    const config: PluginConfig = {};

    for (const [key, value] of parts) {
      config[key] = await this.cryptoService.decrypt(value);
    }

    return config;
  }

  private async getPluginConfigsPath() {
    return await this.fsService.getOrCreateDir(path.resolve(process.cwd(), 'plugin-configs'));
  }

  private async getPluginConfigPath(pluginName: string) {
    return path.resolve(await this.getPluginConfigsPath(), `.env.${pluginName}`);
  }
}
