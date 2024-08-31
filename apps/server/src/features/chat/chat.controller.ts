import { Controller, Get, Query, Res, Sse } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Response } from "express";
import { OpenAIService } from "integrations/openai/openai.service";

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly openAiService: OpenAIService,
  ) { }

  @Sse()
  async chat(
    @Query('q') query: string,
    @Query('tid') threadId?: string,
  ) {
    return await this.chatService.chat(query, threadId);
  }

  @Get('speech')
  async speech(
    @Query('input') input: string,
    @Res() res: Response,
  ) {
    if (input.trim().length > 0) {
      const buffer = await this.openAiService.createSpeech(input.trim());

      res.end(Buffer.from(buffer));
    }
  }
}
