import { Controller, Get, Query, Res, Sse } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Response } from "express";

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

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
    const buffer = await this.chatService.createSpeech(input);

    res.end(Buffer.from(buffer));
  }
}
