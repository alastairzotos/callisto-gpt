import { Injectable } from "@nestjs/common";
import * as fsp from 'fs/promises';

@Injectable()
export class FileSystemService {
  async readFile(pathname: string) {
    return (await fsp.readFile(pathname, 'utf-8')).toString()
  }

  async writeFile(pathname: string, data: string) {
    await fsp.writeFile(pathname, data, 'utf-8');
  }

  async copyFile(src: string, dest: string) {
    await fsp.copyFile(src, dest);
  }

  async copyDir(src: string, dest: string) {
    await fsp.cp(src, dest, { recursive: true });
  }

  async exists(pathname: string) {
    try {
      await fsp.access(pathname);
      return true;
    } catch {
      return false;
    }
  }

  async getOrCreateFile(pathname: string, content = '') {
    if (!await this.exists(pathname)) {
      await fsp.writeFile(pathname, content);
    }

    return pathname;
  }

  async getOrCreateDir(dirname: string) {
    if (!await this.exists(dirname)) {
      await fsp.mkdir(dirname);
    }

    return dirname;
  }
}
