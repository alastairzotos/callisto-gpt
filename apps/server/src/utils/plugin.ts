import { PluginFunction, PluginFunctionParameter, PluginFunctions } from "@bitmetro/callisto"
import OpenAI from "openai";

export const mapPluginFunctionsToPrompts = (plugins: PluginFunctions): string =>
  `You are provided with the following functions:\n${Object.entries(plugins).map(([name, plugin]) => mapPluginFunctionToPrompt(name, plugin)).join('\n')}
  Only call those functions and no others`;

export const mapPluginFunctionToOpenAIFunction = (name: string, plugin: PluginFunction): OpenAI.Beta.Assistants.AssistantTool => ({
  type: 'function',
  function: {
    name: name,
    description: plugin.description,
    parameters: {
      type: 'object',
      required: Object.keys(plugin.parameters),
      properties: Object.entries(plugin.parameters).reduce(
        (acc, [name, param]) => ({
          ...acc,
          [name]: {
            type: 'string',
            description: param.description,
          }
        }),
        {} as Record<string, { type: string, description: string }>
      ),
    }
  }
});

const mapPluginFunctionToPrompt = (name: string, plugin: PluginFunction): string =>
  `- ${name}: ${plugin.instructions}, and pass the following arguments:\n${mapPluginParamsToPrompt(plugin.parameters)}`;

const mapPluginParamsToPrompt = (params: Record<string, PluginFunctionParameter>): string =>
  Object.entries(params).map(
    ([name, param]) => `  * ${name}: ${param.instructions}`
  ).join('\n');