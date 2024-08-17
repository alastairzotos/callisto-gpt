import { relations } from 'drizzle-orm';
import { uuid, timestamp, pgTable, varchar } from 'drizzle-orm/pg-core';

type DoesExtend<T, U extends T> = U;

const commonColumns = {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
}

export const PluginTable = pgTable('plugins', {
  ...commonColumns,
  name: varchar('name', { length: 255 }).notNull(),
});

export const PluginConfigTable = pgTable('plugin_configs', {
  pluginId: uuid('plugin_id').notNull().references(() => PluginTable.id),
  key: varchar('key', { length: 255 }),
  value: varchar('value', { length: 255 }),
});


// ------------------------------------------------------------------------------------------------
// Relations
// ------------------------------------------------------------------------------------------------

export const PluginTableRelations = relations(PluginTable, ({ many }) => ({
  configs: many(PluginConfigTable),
}));
