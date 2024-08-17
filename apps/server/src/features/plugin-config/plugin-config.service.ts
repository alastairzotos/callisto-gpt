import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CryptoService } from "features/crypto/crypto.service";
import { PluginService } from "features/plugin/plugin.service";
import { PluginConfig } from "types/plugin-configs";
import { PluginConfigRepository } from "features/plugin-config/plugin-config.repository";

@Injectable()
export class PluginConfigService {
  constructor(
    private readonly pluginConfigRepo: PluginConfigRepository,
    private readonly cryptoService: CryptoService,

    @Inject(forwardRef(() => PluginService))
    private readonly pluginService: PluginService,
  ) {}

  async setPluginConfig(pluginName: string, config: PluginConfig) {
    const plugin = await this.pluginService.getPluginByName(pluginName);

    if (plugin) {
      const encryptedConfig: Array<{ key: string, value: string }> = [];

      for (const [key, value] of Object.entries(config)) {
        encryptedConfig.push({ key, value: this.cryptoService.encrypt(value) });
      }

      await this.pluginConfigRepo.setPluginConfig(plugin.id, encryptedConfig);
      await this.pluginService.restartPlugin(pluginName);
    }
  }

  async loadPluginConfig(pluginName: string): Promise<PluginConfig> {
    const plugin = await this.pluginService.getPluginByName(pluginName);

    if (plugin) {
      const encryptedConfig = await this.pluginConfigRepo.getPluginConfig(plugin.id);

      const config: PluginConfig = {};

      for (const { key, value } of encryptedConfig) {
        config[key!] = this.cryptoService.decrypt(value!);
      }

      return config;
    }

    return {};
  }
}
