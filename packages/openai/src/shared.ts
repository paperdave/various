export type FinishReason = 'stop' | 'length';

export interface RawCompletionUsage {
  prompt_tokens: 10;
  completion_tokens: 10;
  total_tokens: 20;
}

export interface CompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  price: number;
}

export const td = /* @__PURE__ */ new TextDecoder();
