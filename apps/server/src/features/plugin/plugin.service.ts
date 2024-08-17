import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { parse } from 'yaml';
import { Plugin, PluginFunctionsWithHandlers, PluginHandler } from "@bitmetro/callisto";
import { ChatService } from "features/chat/chat.service";
import { FileSystemService } from "features/file-system/file-system.service";
import { RegistryService } from "integrations/registry/registry.service";
import { PluginRepository } from "features/plugin/plugin.repository";
import { PluginConfigService } from "features/plugin-config/plugin-config.service";
import * as path from 'path';
import * as cproc from 'child_process';

@Injectable()
export class PluginService {
  private workers: Record<string, cproc.ChildProcess> = {};

  constructor(
    private readonly chatService: ChatService,
    private readonly fsService: FileSystemService,
    private readonly registryService: RegistryService,
    private readonly pluginRepo: PluginRepository,

    @Inject(forwardRef(() => PluginConfigService))
    private readonly pluginConfigService: PluginConfigService,
  ) {}

  async getPluginByName(name: string) {
    return await this.pluginRepo.getPluginByName(name);
  }

  async installPlugin(name: string) {
    await this.registryService.fetchPlugin(name, await this.getPluginPath(name));
    await this.addShim(name);
    await this.registerPlugin(name);
    await this.applyPlugin(name);
  }

  async startPlugins() {
    const plugins = await this.pluginRepo.getPlugins();

    for (const { name } of plugins) {
      await this.applyPlugin(name);
    }
  }

  async restartPlugin(pluginName: string) {
    if (this.workers[pluginName]) {
      this.workers[pluginName].kill();

      await this.applyPlugin(pluginName);
    }
  }

  private async registerPlugin(name: string) {
    await this.pluginRepo.addPlugin(name);
  }

  private async applyPlugin(name: string) {
    console.log(`Applying plugin ${name}...`);

    const pluginPath = await this.getPluginPath(name);

    const yamlPath = path.resolve(pluginPath, 'plugin.yaml');

    const yamlContent = await this.fsService.readFile(yamlPath);
    const pluginData = parse(yamlContent).plugin as Plugin;

    const functions = Object.entries(pluginData.functions);

    const functionsWithHandlers: PluginFunctionsWithHandlers = {};

    for (const [funcName, func] of functions) {
      functionsWithHandlers[funcName] = {
        ...func,
        handler: await this.buildHandler(name, pluginPath, funcName),
      };
    }

    await this.chatService.applyFunctions(functionsWithHandlers);

    console.log(`Applied plugin ${name}`);
  }

  private async buildHandler(pluginName: string, pluginPath: string, funcName: string, ): Promise<PluginHandler> {
    const config = await this.pluginConfigService.loadPluginConfig(pluginName);

    const worker = cproc.fork(path.resolve(pluginPath, 'shim.js'), [], { silent: true, env: config });
    this.workers[pluginName] = worker;

    worker.stdout?.pipe(process.stdout);
    worker.stderr?.pipe(process.stderr);

    return async (args) => {
      return new Promise<string>((resolve) => {
        worker.on('message', resolve);
        worker.send({ funcName, args });
      })
    }
  }

  private async addShim(pluginName: string) {
    await this.fsService.copyFile(
      path.resolve(process.cwd(), 'templates', 'shim.js'),
      path.resolve(await this.getPluginPath(pluginName), 'shim.js')
    );
  }

  private async getPluginsPath() {
    return await this.fsService.getOrCreateDir(path.resolve(process.cwd(), 'plugins'));
  }

  private async getPluginPath(name: string) {
    return await this.fsService.getOrCreateDir(path.resolve(await this.getPluginsPath(), name));
  }

}
