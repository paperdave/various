export type FinishReason = 'stop' | 'length';

export interface RawCompletionUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface CompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  price: number;
}

export const td = /* @__PURE__ */ new TextDecoder();
