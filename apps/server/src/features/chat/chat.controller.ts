import { Controller, Query, Sse } from "@nestjs/common";
import { ChatService } from "./chat.service";

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
}
