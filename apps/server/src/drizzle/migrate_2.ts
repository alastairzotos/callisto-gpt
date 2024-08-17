import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { environment } from 'environment/environment';

const migrationClient = postgres(environment.dbConnectionString, {
  max: 1,
});

const runMigrations = async () => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: './src/drizzle/migrations',
  });

  await migrationClient.end();
};

runMigrations();
