import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ChatService } from 'features/chat/chat.service';
import { Plugins } from '@bitmetro/callisto';
import { environment } from 'environment/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const plugins: Plugins = {
    get_weather: {
      description: 'Retrieves the weather at a location',
      instructions: "Call this when the user asks what the weather is like",
      parameters: {
        location: {
          description: "The location where the user wants to get the weather",
          instructions: "Pass a specific name for the location, ask the user for clarification if necessary"
        },
        date: {
          description: "The date the user is enquiring about",
          instructions: "Pass the date the user is asking about, and default to today"
        }
      },
      handler: async ({ location, date }) => {
        console.log(location, date);
        const url = `http://api.weatherapi.com/v1/current.json?key=${environment.weatherApiKey}&q=${location}&aqi=no`;

        const res = await fetch(url);
        const data = await res.json();

        return `${data.current.temp_c}°C, ${data.current.condition.text}`;
      }
    }
  };

  await app.get(ChatService).applyPlugins(plugins);

  await app.listen(5000);
}

bootstrap();
