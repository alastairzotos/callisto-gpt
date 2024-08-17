import { Inject, Module, Provider } from '@nestjs/common';
import * as postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { EnvironmentService } from 'environment/environment.service';
import { EnvironmentModule } from 'environment/environment.module';

const DRIZZLE_TOKEN = 'drizzleProvider';

export const DrizzleProvider: Provider = {
  provide: DRIZZLE_TOKEN,
  inject: [EnvironmentService],
  useFactory: async (env: EnvironmentService) => {
    const client = postgres(env.get().dbConnectionString);
    return drizzle(client, {
      schema,
      logger: false, // env.get().nodeEnv !== 'production',
    });
  },
};

export const InjectDb = () => Inject(DRIZZLE_TOKEN);

export type Database = PostgresJsDatabase<typeof schema>;

@Module({
  imports: [EnvironmentModule],
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}
