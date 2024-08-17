import { Injectable } from "@nestjs/common";
import { Database, InjectDb } from "drizzle/provider";
import { PluginTable } from "drizzle/schemas";

@Injectable()
export class PluginRepository {
  constructor(
    @InjectDb()
    private readonly db: Database,
  ) {}

  async getPlugins() {
    return await this.db.query.PluginTable.findMany({});
  }

  async getPluginByName(name: string) {
    return await this.db.query.PluginTable.findFirst({ where: (t, { eq }) => eq(t.name, name) });
  }

  async addPlugin(name: string) {
    await this.db.insert(PluginTable).values({ name });
  }
}
