import { PluginFunctionsWithHandlers } from "@bitmetro/callisto";
import { Injectable } from "@nestjs/common";
import { OpenAIService } from "integrations/openai/openai.service";
import OpenAI from "openai";
import { mapPluginFunctionToOpenAIFunction, mapPluginFunctionsToPrompts } from "utils/plugin";
import { ChatResponder } from "utils/responder";

@Injectable()
export class ChatService {
  private functions: PluginFunctionsWithHandlers = {};

  constructor(
    private readonly openAi: OpenAIService,
  ) {}

  async applyFunctions(functions: PluginFunctionsWithHandlers) {
    this.functions = functions;

    const tools = Object.entries(functions).map(([name, func]) => mapPluginFunctionToOpenAIFunction(name, func));
    const instructions = `You are a useful assistant. Help the user with their queries.\n\n${mapPluginFunctionsToPrompts(functions)}\n`;

    await this.openAi.updateAssistant(instructions, tools);
  }

  async chat(query: string, threadId?: string) {
    const thread = threadId
      ? await this.openAi.getThread(threadId)
      : await this.openAi.createThread();

    const responder = new ChatResponder();

    await this.openAi.addMessageToThread(thread, {
      role: 'user',
      content: query,
    });

    const stream = this.openAi.createRunStream(thread);

    // return the Observable and then start pumping back messages
    setTimeout(async () => {
      if (!threadId) {
        responder.sendThreadId(thread.id);
      }

      for await (const event of stream) {
        await this.processEvent(event, responder);
      }

      responder.sendStop();
    }, 0);

    return responder.asObservable();
  }

  private async processEvent(event: OpenAI.Beta.Assistants.AssistantStreamEvent, responder: ChatResponder) {
    try {
      switch (event.event) {
        case 'thread.message.delta':
          if (event.data.delta.content[0].type === 'text') {
            const text = event.data.delta.content[0].text?.value as string;
            responder.sendText(text);
          }
          break;

        case 'thread.run.requires_action':
          await this.handleRequiresAction(event.data, responder);
          break;
      }
    } catch (error) {
      console.error("Error handling event:", error);
    }
  }

  private async handleRequiresAction(data: OpenAI.Beta.Threads.Runs.Run, responder: ChatResponder) {
    const { id, thread_id } = data;

    try {
      const toolOutputs = await Promise.all(
        data.required_action.submit_tool_outputs.tool_calls.map(
          (toolCall) => this.handleFunctionCall(toolCall),
        ).filter(i => !!i)
      );

      const stream = this.openAi.submitToolOutputsStream(thread_id, id, toolOutputs);

      for await (const event of stream) {
        this.processEvent(event, responder);
      }
    } catch (error) {
      console.error("Error processing required action:", error);
    }
  }

  private async handleFunctionCall(
    toolCall: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall,
  ): Promise<OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput> {
    const args = JSON.parse(toolCall.function.arguments);

    const output = await this.functions[toolCall.function.name].handler(args);

    return { tool_call_id: toolCall.id, output }
  }
}
