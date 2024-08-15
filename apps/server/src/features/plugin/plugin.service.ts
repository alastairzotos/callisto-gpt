import { Injectable } from "@nestjs/common";
import { EnvironmentService } from "environment/environment.service";
import * as path from 'path';
import * as fsp from 'fs/promises';
import { parse } from 'yaml';
import { Plugin, PluginFunctionsWithHandlers } from "@bitmetro/callisto";
import { ChatService } from "features/chat/chat.service";
import { Manifest } from "types/manifest";

@Injectable()
export class PluginService {
  constructor(
    private readonly envService: EnvironmentService,
    private readonly chatService: ChatService,
  ) {}

  async installPlugin(name: string) {
    const pluginPath = await this.fetchPlugin(name);
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

    const yamlContent = await fsp.readFile(yamlPath, 'utf-8');
    const pluginData = parse(yamlContent).plugin as Plugin;

    const functions = Object.entries(pluginData.functions);
    const functionsWithHandlers = functions.reduce(
      (acc, [name, func]) => ({
        ...acc,
        [name]: {
          ...func,
          handler: async (args) => {
            console.log(`Called '${name}'`, args);
            return "Sunny, 34 degrees";
          }
        }
      }),
      {} as PluginFunctionsWithHandlers
    );

    await this.chatService.applyFunctions(functionsWithHandlers);

    console.log(`Applied plugin ${name}`);
  }

  private async fetchPlugin(name: string) {
    return new Promise<string>(async (resolve) => {
      console.log(`Downloading plugin ${name}...`);
      const pluginPath = path.resolve(this.envService.get().pluginsUrl, name);
      const distPath = path.resolve(pluginPath, 'dist');
      
      const downloadedPluginPath = await this.getPluginPath(name);

      await fsp.cp(distPath, downloadedPluginPath, { recursive: true });

      console.log(`Downloaded plugin ${name}`);
      resolve(downloadedPluginPath);
    })
  }

  private async getPluginsPath() {
    return await this.getOrCreateDir(path.resolve(process.cwd(), 'plugins'));
  }

  private async getPluginPath(name: string) {
    return await this.getOrCreateDir(path.resolve(await this.getPluginsPath(), name));
  }

  private async getManifestPath() {
    const pluginsPath = await this.getPluginsPath();
    return await this.getOrCreateFile(path.resolve(pluginsPath, 'manifest.json'), '{}');
  }

  private async getManifest() {
    const manifestPath = await this.getManifestPath();
    return JSON.parse((await fsp.readFile(manifestPath)).toString()) as Manifest;
  }

  private async updateManifest(manifest: Manifest) {
    const manifestPath = await this.getManifestPath();
    await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  }

  private async getOrCreateFile(pathname: string, content = '') {
    try {
      await fsp.access(pathname);
    } catch {
      await fsp.writeFile(pathname, content);
    }

    return pathname;
  }

  private async getOrCreateDir(dirname: string) {
    try {
      await fsp.access(dirname);
    } catch {
      await fsp.mkdir(dirname);
    }

    return dirname;
  }
}
