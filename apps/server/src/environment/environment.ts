import { config } from 'dotenv';

config();

export const environment = {
  clientUrl: process.env.CLIENT_URL as string || 'https://callisto.bitmetro.io',
  dbConnectionString: process.env.DATABASE_CONNECTION_STRING as string,
  openAiApiKey: process.env.OPENAI_API_KEY as string,
  openAiAsstId: process.env.OPENAI_ASST_ID as string,
  aesKey: process.env.AES_KEY as string,
  pluginsUrl: process.env.PLUGINS_URL as string,
};
