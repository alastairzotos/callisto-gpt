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

  async getOrCreateFile(pathname: string, content = '') {
    try {
      await fsp.access(pathname);
    } catch {
      await fsp.writeFile(pathname, content);
    }

    return pathname;
  }

  async getOrCreateDir(dirname: string) {
    try {
      await fsp.access(dirname);
    } catch {
      await fsp.mkdir(dirname);
    }

    return dirname;
  }
}
