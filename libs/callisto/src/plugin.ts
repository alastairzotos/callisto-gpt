export interface PluginFunctionParameter {
  description: string;
  instructions: string;
}

export type PluginFunctionParameters = Record<string, PluginFunctionParameter>;

export interface PluginFunction {
  description: string;
  instructions: string;
  parameters: PluginFunctionParameters;
}

export type PluginHandler = (...args: string[]) => Promise<string>;

export type PluginFunctionWithHandler = PluginFunction & {
  handler: PluginHandler;
}

export type PluginFunctions = Record<string, PluginFunction>;
export type PluginFunctionsWithHandlers = Record<string, PluginFunctionWithHandler>;

export interface Plugin {
  name: string;
  description: string;
  functions: PluginFunctions;
}

export type Plugins = Record<string, Plugin>;
