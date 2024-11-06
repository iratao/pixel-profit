export interface LLMParams {
  frequencyPenalty?: number;
  maxTokens?: number;
  presencePenalty?: number;
  temperature?: number;
  topP?: number;
}

export interface CompletionArgs {
  imagePath: string;
  llmParams?: LLMParams;
  model: ModelOptions | string;
}

export enum ModelOptions {
  gpt_4o = "gpt-4o",
  gpt_4o_mini = "gpt-4o-mini",
}

export interface CompletionResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
}