import { Injectable } from "@nestjs/common";
import { EnvironmentService } from "environment/environment.service";
import { FileSystemService } from "features/file-system/file-system.service";
import * as path from 'path';

@Injectable()
export class RegistryService {
  constructor(
    private readonly envService: EnvironmentService,
    private readonly fsService: FileSystemService,
  ) {}

  async fetchPlugin(name: string, dest: string) {
    return new Promise<void>(async (resolve) => {
      console.log(`Downloading plugin ${name}...`);
      const pluginPath = path.resolve(this.envService.get().pluginsUrl, name);
      const distPath = path.resolve(pluginPath, 'dist');

      await this.fsService.copyDir(distPath, dest);

      console.log(`Downloaded plugin ${name}`);
      resolve();
    })
  }
}
