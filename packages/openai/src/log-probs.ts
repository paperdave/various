export interface RawLogProbs {
  /** List of tokens. */
  tokens: string[];
  /** Log probs of each token. */
  token_logprobs: number[];
  /** For each token, a record of the top n tokens and each probability. */
  top_logprobs: Record<string, number>[];
  /** Character offset of each token, relative from the START OF THE PROMPT. */
  text_offset: number[];
}

export class LogProbs {
  tokens: string[];
  tokenLogProbs: number[];
  topLogProbs: Record<string, number>[];
  textOffsets: number[];

  constructor(raw: RawLogProbs) {
    this.tokens = raw.tokens;
    this.tokenLogProbs = raw.token_logprobs;
    this.topLogProbs = raw.top_logprobs;
    this.textOffsets = raw.text_offset;
  }

  // TODO: methods to make this more interesting
}

// hidden please
LogProbs.prototype['toJSON'] = function () {
  return {
    tokens: this.tokens,
    tokenLogProbs: this.tokenLogProbs,
    topLogProbs: this.topLogProbs,
    textOffsets: this.textOffsets,
  };
};
