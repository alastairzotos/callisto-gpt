export interface PluginFunctionParameter {
  description: string;
  instructions: string;
}

export interface PluginFunction {
  description: string;
  instructions: string;
  parameters: Record<string, PluginFunctionParameter>;
  handler: (params: Record<string, string>) => Promise<string>;
}

export type Plugins = Record<string, PluginFunction>;
