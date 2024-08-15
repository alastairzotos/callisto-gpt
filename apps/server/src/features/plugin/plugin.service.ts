import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EnvironmentService } from "environment/environment.service";
import * as path from 'path';
import { parse } from 'yaml';
import * as cproc from 'child_process';
import { Plugin, PluginFunctionsWithHandlers, PluginHandler } from "@bitmetro/callisto";
import { ChatService } from "features/chat/chat.service";
import { Manifest } from "types/manifest";
import { PluginConfigsService } from "features/plugin-configs/plugin-configs.service";
import { FileSystemService } from "features/file-system/file-system.service";
import { RegistryService } from "integrations/registry/registry.service";

@Injectable()
export class PluginService {
  private workers: Record<string, cproc.ChildProcess> = {};

  constructor(
    private readonly envService: EnvironmentService,
    private readonly chatService: ChatService,
    private readonly fsService: FileSystemService,
    private readonly registryService: RegistryService,

    @Inject(forwardRef(() => PluginConfigsService))
    private readonly pluginConfigsService: PluginConfigsService,
  ) {}

  async installPlugin(name: string) {
    await this.registryService.fetchPlugin(name, await this.getPluginPath(name));
    await this.addShim(name);
    await this.registerPlugin(name);
    await this.applyPlugin(name);
  }

  async startPlugins() {
    const manifest = await this.getManifest();

    for (const [name] of Object.entries(manifest)) {
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
    const manifest = await this.getManifest();

    await this.updateManifest({
      ...manifest,
      [name]: '1.0.0',
    });
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
    const config = await this.pluginConfigsService.loadPluginConfig(pluginName);

    console.log(config);

    const worker = cproc.fork(path.resolve(pluginPath, 'shim.js'), [], { silent: true, env: config });
    this.workers[pluginName] = worker;

    worker.stdout.pipe(process.stdout);
    worker.stderr.pipe(process.stderr);

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

  private async getManifestPath() {
    const pluginsPath = await this.getPluginsPath();
    return await this.fsService.getOrCreateFile(path.resolve(pluginsPath, 'manifest.json'), '{}');
  }

  private async getManifest() {
    const manifestPath = await this.getManifestPath();
    return JSON.parse((await this.fsService.readFile(manifestPath))) as Manifest;
  }

  private async updateManifest(manifest: Manifest) {
    const manifestPath = await this.getManifestPath();
    await this.fsService.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }
}
