import { defineConfig } from 'drizzle-kit';
import { environment } from './src/environment/environment';

export default defineConfig({
  dbCredentials: {
    url: environment.dbConnectionString,
  },
  dialect: 'postgresql',
  schema: './src/drizzle/schemas/index.ts',
  out: './src/drizzle/migrations',
  verbose: true,
  strict: true,
});
