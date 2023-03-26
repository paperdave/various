import { createArray, IterableStream } from '@paperdave/utils';
import { LogProbs, RawLogProbs } from 'log-probs';
import { AuthOverride, getAuthHeaders } from './api-key';
import { ChatModel, PRICING_TEXT, TextModel } from './models';
import { CompletionUsage, FinishReason, RawCompletionUsage, td } from './shared';
import { countTokens } from './tokenization';

export interface RawTextCompletion {
  id: string;
  object: 'text_completion';
  /** Unix time in seconds. */
  created: number;
  model: TextModel;
  usage: RawCompletionUsage;
  choices: RawTextCompletionChoice[];
}

export interface RawTextCompletionChoice {
  text: string;
  index: number;
  logprobs?: RawLogProbs | null;
  finish_reason: FinishReason;
}

interface RawTextCompletionChunk {
  id: string;
  object: 'text_completion';
  created: number;
  choices: RawTextCompletionChoice[];
  model: TextModel;
}

export interface TextCompletionOptions<
  Stream extends boolean = boolean,
  N extends number = number,
  NumLogProbs extends number = number
> {
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to
   * see all of your available models, or see our [Model overview](/docs/models/overview) for
   * descriptions of them.
   */
  model: TextModel;
  /**
   * The prompt(s) to generate completions for, encoded as a string.
   *
   * Note that <|endoftext|> is the document separator that the model sees during training, so if a
   * prompt is not specified the model will generate as if from the beginning of a new document.
   */
  prompt: string;
  /** The suffix that comes after a completion of inserted text. */
  suffix?: string | null;
  /**
   * If set, partial message deltas will be sent, like in ChatGPT. Instead of being given a string,
   * you are given an async iterator of strings. Other metadata is available as a promise given on
   * the result object. See `TextCompletionStream` for more details.
   */
  stream?: Stream;
  /**
   * The maximum number of [tokens](/tokenizer) to generate in the completion. The token count of
   * your prompt plus `max_tokens` cannot exceed the model's context length. Most models have a
   * context length of 2048 tokens (except for the newest models, which support 4096).
   */
  max_tokens?: number | null;
  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output
   * more random, while lower values like 0.2 will make it more focused and deterministic. We
   * generally recommend altering this or `top_p` but not both.
   */
  temperature?: number | null;
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers
   * the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising
   * the top 10% probability mass are considered. We generally recommend altering this or
   * `temperature` but not both.
   */
  top_p?: number | null;
  /**
   * How many completions to generate for each prompt. **Note:** Because this parameter generates
   * many completions, it can quickly consume your token quota. Use carefully and ensure that you
   * have reasonable settings for `max_tokens` and `stop`.
   */
  n?: N | null;
  /**
   * Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens.
   * For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The
   * API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1`
   * elements in the response. The maximum value for `logprobs` is 5. If you need more than this,
   * please contact us through our [Help center](https://help.openai.com) and describe your use case.
   */
  logprobs?: NumLogProbs | null;
  /** Up to 4 sequences where the API will stop generating further tokens. */
  stop?: string | string[] | null;
  /** Echo back the prompt in addition to the completion. */
  echo?: boolean | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear
   * in the text so far, increasing the model's likelihood to talk about new topics. [See more
   * information about frequency and presence penalties.](/docs/api-reference/parameter-details)
   */
  presence_penalty?: number | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing
   * frequency in the text so far, decreasing the model's likelihood to repeat the same line
   * verbatim. [See more information about frequency and presence
   * penalties.](/docs/api-reference/parameter-details)
   */
  frequency_penalty?: number | null;
  /**
   * Generates `best_of` completions server-side and returns the "best" (the one with the highest
   * log probability per token). Results cannot be streamed. When used with `n`, `best_of` controls
   * the number of candidate completions and `n` specifies how many to return – `best_of` must be
   * greater than `n`. **Note:** Because this parameter generates many completions, it can quickly
   * consume your token quota. Use carefully and ensure that you have reasonable settings for
   * `max_tokens` and `stop`.
   */
  best_of?: number | null;
  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a json object
   * that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value
   * from -100 to 100. You can use this [tokenizer tool](/tokenizer?view=bpe) (which works for both
   * GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits
   * generated by the model prior to sampling. The exact effect will vary per model, but values
   * between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100
   * should result in a ban or exclusive selection of the relevant token. As an example, you can
   * pass `{\"50256\": -100}` to prevent the <|endoftext|> token from being generated.
   */
  logit_bias?: object | null;
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect
   * abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
   */
  user?: string;

  /** Number of retries before giving up. Defaults to 3. */
  retry?: number;

  auth?: AuthOverride;
}

export interface TextCompletionMetadata {
  created: Date;
  model: TextModel;
  usage: CompletionUsage;
}

export type TextCompletion<NumLogProbs extends number = number> = TextCompletionMetadata &
  TextCompletionChoice<NumLogProbs>;

export interface TextCompletionMulti<NumLogProbs extends number = number>
  extends TextCompletionMetadata {
  choices: TextCompletionChoice<NumLogProbs>[];
}

export interface TextCompletionStream<NumLogProbs extends number = number> {
  content: AsyncIterableIterator<string>;
  data: Promise<TextCompletion<NumLogProbs>>;
}

export interface TextCompletionMultiStream<NumLogProbs extends number = number> {
  choices: AsyncIterableIterator<string>[];
  data: Promise<TextCompletionMulti<NumLogProbs>>;
}

export type TextCompletionChoice<NumLogProbs extends number = number> = {
  content: string;
  finishReason: FinishReason;
} & (0 extends NumLogProbs ? {} : { logProbs: LogProbs });

export type TextCompletionResultFromOptions<
  Stream extends boolean = false,
  N extends number = 1,
  NumLogProbs extends number = 0
> = false extends Stream
  ? 1 extends N
    ? TextCompletion<NumLogProbs>
    : TextCompletionMulti<NumLogProbs>
  : 1 extends N
  ? TextCompletionStream<NumLogProbs>
  : TextCompletionMultiStream<NumLogProbs>;

export async function generateTextCompletion<
  Stream extends boolean,
  N extends number,
  NumLogProbs extends number
>(
  options: TextCompletionOptions<Stream, N, NumLogProbs>
): Promise<TextCompletionResultFromOptions<Stream, N, NumLogProbs>> {
  const { retry: retryCount, auth, ...gptOptions } = options;

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(auth),
    },
    body: JSON.stringify(gptOptions),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(error)}`);
  }

  if (gptOptions.stream) {
    const reader = (response as any).body.getReader();
    if (!reader) {
      throw new Error('No Response');
    }
    const streams = createArray(gptOptions.n ?? 1, () => new IterableStream<string>());
    const completion: any = {};
    if (streams.length === 1) {
      completion.content = streams[0];
    } else {
      completion.choices = streams;
    }
    completion.data = (async () => {
      const choices = createArray(streams.length, () => ({ content: '' })) as any;
      const metadata: any = {
        created: null as any,
        model: null as any,
        usage: {
          promptTokens:
            countTokens(gptOptions.model, String(gptOptions.prompt)) +
            (gptOptions.suffix ? countTokens(gptOptions.model, gptOptions.suffix) : 0),
          completionTokens: 0,
          totalTokens: 0,
          price: 0,
        },
      };
      try {
        let { done, value } = await reader.read();
        let buf = '';
        do {
          const lines = (td.decode(value) + buf).split('\n');
          buf = lines.pop()!;
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data !== '[DONE]') {
                const obj = JSON.parse(data) as RawTextCompletionChunk;
                if (obj.model && !metadata.model) {
                  metadata.model = obj.model;
                }
                if (obj.created && !metadata.created) {
                  metadata.created = new Date(obj.created * 1000);
                }
                for (const choice of obj.choices) {
                  if (choice.text) {
                    streams[choice.index].push(choice.text);
                    choices[choice.index].content += choice.text;
                  }
                  if (choice.finish_reason) {
                    choices[choice.index].finishReason = choice.finish_reason;
                  }
                  if (choice.logprobs) {
                    choices[choice.index].logProbs ??= {
                      tokens: [],
                      token_logprobs: [],
                      top_logprobs: [],
                      text_offset: [],
                    };
                    choices[choice.index].logProbs.tokens.push(...choice.logprobs.tokens);
                    choices[choice.index].logProbs.token_logprobs.push(
                      ...choice.logprobs.token_logprobs
                    );
                    choices[choice.index].logProbs.top_logprobs.push(
                      ...choice.logprobs.top_logprobs
                    );
                    choices[choice.index].logProbs.text_offset.push(...choice.logprobs.text_offset);
                  }
                }
              }
            }
          }
          ({ done, value } = await reader.read());
        } while (!done);
      } finally {
        reader.releaseLock();
      }
      streams.forEach(stream => stream.end());
      metadata.usage.completionTokens = choices
        .map(x => countTokens(gptOptions.model, x.content))
        .reduce((a, b) => a + b, 0);
      metadata.usage.totalTokens = metadata.usage.promptTokens + metadata.usage.completionTokens;
      metadata.usage.price = PRICING_TEXT[metadata.model as ChatModel] * metadata.usage.totalTokens;
      if (choices.length === 1) {
        metadata.content = choices[0].content;
        metadata.finishReason = choices[0].finishReason;
      } else {
        metadata.choices = choices.map(choice => {
          if (choice.logProbs) {
            choice.logProbs = new LogProbs(choice.logProbs);
          }
          return choice;
        });
      }
      return metadata;
    })();
    return completion;
  }

  const json = (await response.json()) as RawTextCompletion;

  const completion: TextCompletion | TextCompletionMulti = {
    ...(json.choices.length === 1
      ? {
          content: json.choices[0].text,
          finishReason: json.choices[0].finish_reason,
          ...(json.choices[0].logprobs ? { logProbs: new LogProbs(json.choices[0].logprobs) } : {}),
        }
      : {
          choices: json.choices.map(x => ({
            content: x.text,
            finishReason: x.finish_reason,
            ...(x.logprobs ? { logProbs: new LogProbs(x.logprobs) } : {}),
          })),
        }),
    created: new Date(json.created * 1000),
    model: json.model,
    usage: {
      promptTokens: json.usage.prompt_tokens,
      completionTokens: json.usage.completion_tokens,
      totalTokens: json.usage.total_tokens,
      price: json.usage.total_tokens * PRICING_TEXT[json.model],
    },
  };

  return completion as any;
}
