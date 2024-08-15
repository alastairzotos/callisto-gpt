import { Injectable } from "@nestjs/common";
import { EnvironmentService } from "environment/environment.service";
import * as path from 'path';
import { parse } from 'yaml';
import * as cproc from 'child_process';
import { Plugin, PluginFunctionsWithHandlers, PluginHandler } from "@bitmetro/callisto";
import { ChatService } from "features/chat/chat.service";
import { Manifest } from "types/manifest";
import { PluginConfigsService } from "features/plugin-configs/plugin-configs.service";
import { FileSystemService } from "features/file-system/file-system.service";

@Injectable()
export class PluginService {
  constructor(
    private readonly envService: EnvironmentService,
    private readonly chatService: ChatService,
    private readonly fsService: FileSystemService,
    private readonly pluginConfigsService: PluginConfigsService,
  ) {}

  async installPlugin(name: string) {
    const pluginPath = await this.fetchPlugin(name);
    await this.addShim(pluginPath);
    await this.registerPlugin(name, pluginPath);
    await this.applyPlugin(name, pluginPath);
  }

  async startPlugins() {
    const manifest = await this.getManifest();

    for (const [name, pluginPath] of Object.entries(manifest)) {
      await this.applyPlugin(name, pluginPath);
    }
  }

  private async registerPlugin(name: string, pluginPath: string) {
    const manifest = await this.getManifest();

    await this.updateManifest({
      ...manifest,
      [name]: pluginPath,
    });
  }

  private async applyPlugin(name: string, pluginPath: string) {
    console.log(`Applying plugin ${name}...`);

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

    const worker = cproc.fork(path.resolve(pluginPath, 'shim.js'), [], { silent: true, env: config });

    worker.stdout.pipe(process.stdout);
    worker.stderr.pipe(process.stderr);

    return async (args) => {
      return new Promise<string>((resolve) => {
        worker.on('message', resolve);
        worker.send({ funcName, args });
      })
    }
  }

  private async fetchPlugin(name: string) {
    return new Promise<string>(async (resolve) => {
      console.log(`Downloading plugin ${name}...`);
      const pluginPath = path.resolve(this.envService.get().pluginsUrl, name);
      const distPath = path.resolve(pluginPath, 'dist');
      
      const downloadedPluginPath = await this.getPluginPath(name);

      await this.fsService.copyDir(distPath, downloadedPluginPath);

      console.log(`Downloaded plugin ${name}`);
      resolve(downloadedPluginPath);
    })
  }

  private async addShim(pluginPath: string) {
    await this.fsService.copyFile(path.resolve(process.cwd(), 'templates', 'shim.js'), path.resolve(pluginPath, 'shim.js'));
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
