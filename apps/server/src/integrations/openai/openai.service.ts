import { Injectable } from "@nestjs/common";
import { EnvironmentService } from "environment/environment.service";
import OpenAI from "openai";


@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private assistant: OpenAI.Beta.Assistants.Assistant;

  constructor(
    private readonly envService: EnvironmentService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.envService.get().openAiApiKey
    })
  }
  
  async updateAssistant(
    instructions: string,
    tools: OpenAI.Beta.Assistants.AssistantTool[],
  ) {
    this.assistant = await this.openai.beta.assistants.update(this.envService.get().openAiAsstId, {
      name: "Minervai",
      model: 'gpt-3.5-turbo-1106',
      instructions,
      tools,
    });
  }

  async createEmbedding(text: string) {
    const result = await this.openai.embeddings.create({
      input: text,
      model: 'text-embedding-ada-002'
    })

    return result.data[0].embedding;
  }

  async createEmbeddings(text: string[]) {
    const result = await this.openai.embeddings.create({
      input: text,
      model: 'text-embedding-ada-002'
    })

    return result.data.map(item => item.embedding);
  }

  async createThread() {
    return await this.openai.beta.threads.create();
  }

  async getThread(threadId: string) {
    return await this.openai.beta.threads.retrieve(threadId);
  }

  async addMessageToThread(thread: OpenAI.Beta.Threads.Thread, message: OpenAI.Beta.Threads.Messages.MessageCreateParams) {
    await this.openai.beta.threads.messages.create(thread.id, message);
  }

  createRunStream(thread: OpenAI.Beta.Threads.Thread) {
    return this.openai.beta.threads.runs.stream(thread.id, {
      assistant_id: this.assistant.id,
    });
  }

  submitToolOutputsStream(threadId: string, runId: string, toolOutputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[]) {
    return this.openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: toolOutputs },
    );
  }
}
