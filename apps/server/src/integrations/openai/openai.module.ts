import { Module } from "@nestjs/common";
import { OpenAIService } from "./openai.service";
import { EnvironmentModule } from "environment/environment.module";

@Module({
  imports: [EnvironmentModule],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule { }
