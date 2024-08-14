import { config } from 'dotenv';

config();

export const environment = {
  openAiApiKey: process.env.OPENAI_API_KEY as string,
  openAiAsstId: process.env.OPENAI_ASST_ID as string,

  weatherApiKey: process.env.WEATHER_API_KEY as string,
};
