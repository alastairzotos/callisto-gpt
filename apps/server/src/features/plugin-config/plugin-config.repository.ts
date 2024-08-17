import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Database, InjectDb } from "drizzle/provider";
import { PluginConfigTable } from "drizzle/schemas";
import { PluginConfig } from "types/plugin-configs";

@Injectable()
export class PluginConfigRepository {
  constructor(
    @InjectDb()
    private readonly db: Database,
  ) {}

  async setPluginConfig(pluginId: string, config: Array<{ key: string, value: string }>) {
    await this.db.delete(PluginConfigTable).where(eq(PluginConfigTable.pluginId, pluginId));
    await this.db.insert(PluginConfigTable).values(
      config.map(({ key, value }) => ({ pluginId, key, value })),
    )
  }

  async getPluginConfig(pluginId: string) {
    return await this.db.query.PluginConfigTable.findMany({
      where: (t, { eq }) => eq(t.pluginId, pluginId),
    });
  }
}
