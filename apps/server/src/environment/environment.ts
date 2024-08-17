import { config } from 'dotenv';

config();

export const environment = {
  dbConnectionString: process.env.DATABASE_CONNECTION_STRING as string,
  openAiApiKey: process.env.OPENAI_API_KEY as string,
  openAiAsstId: process.env.OPENAI_ASST_ID as string,
  aesKey: process.env.AES_KEY as string,
  pluginsUrl: process.env.PLUGINS_URL as string,
};
