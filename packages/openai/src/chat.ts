import { createArray, deferred, IterableStream } from '@paperdave/utils';
import { AnyZodObject, SafeParseReturnType, z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { AuthOverride } from './api-key';
import { OpenAIEventSource } from './event-source-parser';
import { fetchOpenAI, FetchOptions } from './fetch';
import { ChatModel, PRICING_CHAT } from './models';
import { CompletionUsage, FinishReason, RawCompletionUsage } from './shared';
import { getTokenizer } from './tokenization';

export interface ChatCompletionUsage extends CompletionUsage {
  /** GenerateChatCompletion may run multiple generations if functions are used. */
  generations: number;
  /** When multiple functions are used, this count has just the initial prompt tokens. */
  initialPromptTokens: number;
}

export type GPTMessageRole = 'system' | 'user' | 'assistant' | 'function';

export type GPTMessage = GPTMessageString | GPTMessageFunctionCall;

export interface GPTMessageString {
  /** The role of the author of this message. */
  role: GPTMessageRole;
  /** The contents of the message. */
  content: string;
  /** The name of the user in a multi-user chat, or the name of the function called. */
  name?: string;
  /** Function call metadata. */
  function_call?: RawGPTFunctionCall;
}

export interface GPTMessageFunctionCall {
  /** The role of the author of this message. */
  role: 'assistant';
  /** The contents of the message. */
  content?: string | null;
  /** The name of the user in a multi-user chat, or the name of the function called. */
  name?: string;
  function_call: RawGPTFunctionCall;
}

export interface RawGPTFunctionCall {
  /** The name of the function called. */
  name: string;
  /** The parameters passed to the function. */
  arguments: string;
}

export interface RawChatCompletion {
  id: string;
  object: 'chat.completion';
  /** Unix time in seconds. */
  created: number;
  model: ChatModel;
  usage: RawCompletionUsage;
  choices: RawChatCompletionChoice[];
}

export interface RawChatCompletionChoice {
  message: GPTMessage;
  finish_reason: FinishReason;
  index: number;
}

export interface RawChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  /** Unix time in seconds. */
  created: number;
  model: ChatModel;
  choices: RawChatCompletionChunkChoice[];
}

export interface RawChatCompletionChunkChoice {
  delta: Partial<GPTMessage>;
  finish_reason: FinishReason | null;
  index: number;
}

export interface ChatCompletionOptions<
  Stream extends boolean = boolean,
  N extends number = number,
  F extends Record<string, ChatCompletionFunctionOption> = Record<
    string,
    ChatCompletionFunctionOption
  >
> extends FetchOptions {
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to
   * see all of your available models, or see our [Model overview](/docs/models/overview) for
   * descriptions of them.
   */
  model: ChatModel;
  /**
   * The messages to generate chat completions for, in the [chat
   * format](https://platform.openai.com/docs/guides/chat/introduction).
   */
  messages: GPTMessage[];
  /**
   * If set, partial message deltas will be sent, like in ChatGPT. Instead of being given a string,
   * you are given an async iterator of strings. Other metadata is available as a promise given on
   * the result object. See `ChatCompletionStream` for more details.
   */
  stream?: Stream;
  /**
   * The maximum number of [tokens](/tokenizer) to generate in the completion. The token count of
   * your prompt plus `max_tokens` cannot exceed the model's context length. Most models have a
   * context length of 2048 tokens (except for the newest models, which support 4096).
   */
  maxTokens?: number | null;
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
  topP?: number | null;
  /**
   * How many completions to generate for each prompt. **Note:** Because this parameter generates
   * many completions, it can quickly consume your token quota. Use carefully and ensure that you
   * have reasonable settings for `max_tokens` and `stop`.
   */
  n?: N | null;
  /** Up to 4 sequences where the API will stop generating further tokens. */
  stop?: string | string[] | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear
   * in the text so far, increasing the model's likelihood to talk about new topics. [See more
   * information about frequency and presence penalties.](/docs/api-reference/parameter-details)
   */
  presencePenalty?: number | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing
   * frequency in the text so far, decreasing the model's likelihood to repeat the same line
   * verbatim. [See more information about frequency and presence
   * penalties.](/docs/api-reference/parameter-details)
   */
  frequencyPenalty?: number | null;
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
  logitBias?: Record<string, number> | null;
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect
   * abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
   */
  user?: string;

  /**
   * A list of functions the model may generate JSON inputs for. If you pass `run` to any function,
   * it will be run automatically.
   */
  functions?: F;

  /** Number of retries before giving up. Defaults to 3. */
  retry?: number;
  auth?: AuthOverride;
}

export interface ChatCompletionFunctionOption<P extends AnyZodObject = AnyZodObject> {
  /** A description of what this function does. */
  description: string;
  /** The parameters this function accepts, as a zod object. */
  params: P;
  /** The function to run. */
  run?: (params: z.infer<P>) => Promise<any>;
}

export interface ChatCompletionMetadata {
  created: Date;
  model: ChatModel;
  usage: CompletionUsage;
}

export interface ChatCompletion extends ChatCompletionMetadata, ChatCompletionChoice {}

export interface ChatCompletionMulti extends ChatCompletionMetadata {
  choices: ChatCompletionChoice[];
}

export interface ChatCompletionStream {
  tokens: AsyncIterableIterator<string>;
  data: Promise<ChatCompletion>;
}

export interface ChatCompletionMultiStream {
  choices: AsyncIterableIterator<string>[];
  data: Promise<ChatCompletionMulti>;
}

export interface ChatCompletionChoice<
  F extends ChatCompletionFunctionOption = ChatCompletionFunctionOption
> {
  content?: string;
  function?: ChatCompletionFunctionCall<F>;
  finishReason: FinishReason;
}

export type ChatCompletionResultFromOptions<
  Stream extends boolean = false,
  N extends number = 1
> = false extends Stream
  ? 1 extends N
    ? ChatCompletion
    : ChatCompletionMulti
  : 1 extends N
  ? ChatCompletionStream
  : ChatCompletionMultiStream;

function functionsToJSON(functions: Record<string, ChatCompletionFunctionOption>) {
  const fns: any[] = [];
  for (const key in functions) {
    const { params, ...rest } = functions[key];
    const schema = zodToJsonSchema(params) as any;
    delete schema.$schema;
    if (!schema.additionalProperties) delete schema.additionalProperties;
    fns.push({
      name: key,
      description: rest.description,
      parameters: schema,
    });
  }
  return fns;
}

/** Helper class for chat function call objects. Has lazy evaluation for the parsed params. */
export class ChatCompletionFunctionCall<
  T extends ChatCompletionFunctionOption = ChatCompletionFunctionOption
> {
  /** Name of the function called. */
  name: string;
  /** Raw params JSON string from OpenAI. */
  arguments: string;
  /** The function definition. */
  function: T;
  /** The underlying message. */
  message: GPTMessageFunctionCall;

  constructor(msg: GPTMessageFunctionCall, functions?: any) {
    const { name, arguments: args } = msg.function_call;

    this.message = msg;
    this.name = name;
    this.arguments = args;

    this.function = functions?.[name] as T;
  }

  /** Runs json + zod parse on the arguments. */
  parse(): z.infer<T['params']> {
    const jsonParsed = JSON.parse(this.arguments);
    const { function: fn } = this;
    if (fn) {
      return fn.params.parse(jsonParsed);
    } else {
      return jsonParsed;
    }
  }

  /** Runs json + zod parse on the arguments without throwing. */
  safeParse(): SafeParseReturnType<z.input<T['params']>, z.output<T['params']>> {
    try {
      var jsonParsed = JSON.parse(this.arguments);
    } catch (error: any) {
      return {
        success: false,
        error: z.ZodError.create([
          z.makeIssue({
            data: this.arguments,
            path: ['arguments'],
            errorMaps: [],
            issueData: {
              code: 'custom',
              message: error?.message ?? 'Invalid JSON',
            },
          }),
        ]),
      };
    }
    const { function: fn } = this;
    if (fn) {
      return fn.params.safeParse(jsonParsed);
    } else {
      return {
        success: true,
        data: jsonParsed,
      };
    }
  }

  createResponseMessage(result: any): GPTMessage {
    return createResponseMessage(this.name, result);
  }
}

function createResponseMessage(name: string, result: any): GPTMessage {
  return {
    role: 'function',
    name,
    content: JSON.stringify(result),
  };
}

function mapChoice(choice: RawChatCompletionChoice, functionDefinitions?: any) {
  const message = choice.message;
  if ('function_call' in choice.message) {
    return {
      content: null,
      function: new ChatCompletionFunctionCall(choice.message as any, functionDefinitions),
      finishReason: choice.finish_reason,
    };
  }
  return {
    content: message.content,
    finishReason: choice.finish_reason,
  };
}

export async function generateChatCompletion<
  Stream extends boolean,
  N extends number,
  F extends Record<string, ChatCompletionFunctionOption>
>(
  options: ChatCompletionOptions<Stream, N, F>
): Promise<ChatCompletionResultFromOptions<Stream, N>> {
  let { retry, auth, functions, messages, ...gptOptions } = options;

  const inputBody = {
    model: gptOptions.model,
    messages: messages,
    max_tokens: gptOptions.maxTokens ?? (gptOptions as any).max_tokens,
    temperature: gptOptions.temperature,
    top_p: gptOptions.topP ?? (gptOptions as any).top_p,
    n: gptOptions.n,
    stop: gptOptions.stop,
    presence_penalty: gptOptions.presencePenalty ?? (gptOptions as any).presence_penalty,
    frequency_penalty: gptOptions.frequencyPenalty ?? (gptOptions as any).frequency_penalty,
    logit_bias: gptOptions.logitBias ?? (gptOptions as any).logit_bias,
    user: gptOptions.user,
    functions: functions ? functionsToJSON(functions) : undefined,
    stream: gptOptions.stream,
  };

  if (gptOptions.stream && (gptOptions.n ?? 1) !== 1 && functions) {
    throw new Error(
      'calling generateChatCompletion with { n > 1, stream: true, functions } is not yet supported.'
    );
  }

  const response = await fetchOpenAI({
    endpoint: '/chat/completions',
    method: 'POST',
    body: inputBody,
    auth,
    retry,
  });

  if (gptOptions.stream) {
    return finishChatCompletionStream(response, inputBody, options);
  }

  let json = (await response.json()) as RawChatCompletion;

  const usage = {
    promptTokens: ((options as any)._usage?.promptTokens ?? 0) + json.usage.prompt_tokens,
    completionTokens:
      ((options as any)._usage?.completionTokens ?? 0) + json.usage.completion_tokens,
    totalTokens: ((options as any)._usage?.totalTokens ?? 0) + json.usage.total_tokens,
    initialPromptTokens: (options as any)._usage?.initialPromptTokens ?? json.usage.prompt_tokens,
    generations: ((options as any)._usage?.generations ?? 0) + 1,
  };

  // We support autocalling functions if there is only one choice and it is a function call
  if (json.choices.length === 1 && json.choices[0].finish_reason === 'function_call') {
    const callMessage = json.choices[0].message as GPTMessageFunctionCall;
    const fn = functions?.[callMessage.function_call.name];
    if (fn?.run) {
      // TODO: error handling
      const params = fn.params.parse(JSON.parse(callMessage.function_call.arguments));
      const result = await fn.run(params);
      const responseMessage = createResponseMessage(callMessage.function_call.name, result);

      return generateChatCompletion({
        ...options,
        messages: [...messages, callMessage, responseMessage],
        maxTokens: options.maxTokens ? options.maxTokens - json.usage.completion_tokens : undefined,
        _functionMessages: [
          ...((options as any)._functionMessages ?? []),
          callMessage,
          responseMessage,
        ],
        _usage: usage,
      } as any);
    }
  }

  const completion = {
    ...(json.choices.length === 1
      ? mapChoice(json.choices[0], functions)
      : {
          choices: json.choices.map(x => mapChoice(x, functions)),
        }),
    created: new Date(json.created * 1000),
    model: json.model,
    usage: {
      ...usage,
      price:
        usage.promptTokens * PRICING_CHAT[gptOptions.model][0] +
        usage.completionTokens * PRICING_CHAT[gptOptions.model][1],
    },
  };

  return completion as any;
}

export type ChatCompletionStreamToken =
  | {
      type: 'text';
      value: string;
    }
  | {
      type: 'function_call';
      name: string;
      arguments: any;
    }
  | {
      type: 'function_result';
      name: string;
      result: any;
    };

function finishChatCompletionStream(
  response: Response,
  inputBody: any,
  options: ChatCompletionOptions
) {
  const messages = inputBody.messages.slice() as GPTMessage[];
  const streams = createArray(
    inputBody.n ?? 1,
    () => new IterableStream<ChatCompletionStreamToken>()
  );
  const completion: any = {};
  if (streams.length === 1) {
    completion.tokens = streams[0];
  } else {
    completion.choices = streams;
  }

  const tokenizer = getTokenizer(inputBody.model);

  const choices = createArray(streams.length, () => ({
    content: '',
    functionName: '',
    functionArgs: '',
  })) as any;
  const metadata: any = {
    created: null as any,
    model: null as any,
    usage: {
      promptTokens: tokenizer.countGPTChatPrompt({
        messages,
        functions: inputBody.functions,
      }),
      completionTokens: 0,
      totalTokens: 0,
      price: 0,
      generations: 1,
      initialPromptTokens: 0,
    },
  };
  metadata.usage.initialPromptTokens = metadata.usage.promptTokens;

  const [dataPromise, onFinish] = deferred<void>();

  let finishedStreams = 0;

  const reader = response.body?.getReader();
  if (!reader) return;
  const eventSource = new OpenAIEventSource(reader);
  eventSource.onData = (data: RawChatCompletionChunk) => {
    if (data.model && !metadata.model) {
      metadata.model = data.model;
    }
    if (data.created && !metadata.created) {
      metadata.created = new Date(data.created * 1000);
    }
    for (const choice of data.choices) {
      if (choice.delta.content) {
        streams[choice.index].push({
          type: 'text',
          value: choice.delta.content,
        });
        choices[choice.index].content += choice.delta.content;
      }
      if (choice.delta.function_call) {
        if (choice.delta.function_call.name) {
          choices[choice.index].functionName += choice.delta.function_call.name;
        }
        if (choice.delta.function_call.arguments) {
          choices[choice.index].functionArgs += choice.delta.function_call.arguments;
        }
      }
      if (choice.finish_reason) {
        if (choice.finish_reason === 'function_call') {
          (async () => {
            const name = choices[choice.index].functionName;
            const argsRaw = choices[choice.index].functionArgs;
            const fn = options.functions?.[name];
            if (fn?.run) {
              const args = fn.params.parse(JSON.parse(argsRaw));
              streams[choice.index].push({
                type: 'function_call',
                name,
                arguments: args,
              });
              const result = await fn.run(args);
              streams[choice.index].push({
                type: 'function_result',
                name,
                result,
              });
              const callMessage = {
                role: 'assistant',
                content: null,
                function_call: {
                  name,
                  arguments: argsRaw,
                },
              } as any;
              const responseMessage = createResponseMessage(name, result);
              messages.push(callMessage, responseMessage);
              const tokens = tokenizer.countGPTChatPrompt({
                messages,
                functions: inputBody.functions,
              });
              metadata.usage.promptTokens += tokens;
              metadata.usage.completionTokens = tokenizer.countGPTMessage(callMessage);
              metadata.usage.generations++;
              const response = await fetchOpenAI({
                endpoint: '/chat/completions',
                method: 'POST',
                body: {
                  ...inputBody,
                  messages,
                  max_tokens: options.maxTokens ? options.maxTokens - tokens : undefined,
                  stream: true,
                },
              });
              const newReader = response.body?.getReader();
              if (!newReader) return onFinish();
              eventSource.continue(newReader);
            } else {
              onFinish();
            }
          })();
        } else {
          choices[choice.index].finishReason = choice.finish_reason;
          finishedStreams++;
          if (finishedStreams === streams.length) {
            onFinish();
          }
        }
      }
    }
  };

  completion.data = dataPromise.then(() => {
    metadata.usage.completionTokens = choices.reduce(
      (acc: number, choice: any) => acc + tokenizer.count(choice.content),
      0
    );
    metadata.usage.totalTokens = metadata.usage.promptTokens + metadata.usage.completionTokens;
    metadata.usage.price =
      metadata.usage.promptTokens * PRICING_CHAT[inputBody.model][0] +
      metadata.usage.completionTokens * PRICING_CHAT[inputBody.model][1];

    for (const stream of streams) {
      stream.end();
    }
    return metadata;
  });

  return completion;
}
