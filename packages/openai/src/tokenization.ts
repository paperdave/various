// Tiktoken wrapper but with automatic GC and some other helpers
import { get_encoding, Tiktoken as RealTiktoken, TiktokenEncoding } from 'tiktoken';
import { GPTMessage } from './chat';
import { ChatModel, TextModel } from './models';

export interface Tiktoken {
  // Provided by npm package `tiktoken`, camelcased.
  encode: RealTiktoken['encode'];
  encodeOrdinary: RealTiktoken['encode_ordinary'];
  encodeWithUnstable: RealTiktoken['encode_with_unstable'];
  encodeSingleToken: RealTiktoken['encode_single_token'];
  decode: RealTiktoken['decode'];
  decodeSingleTokenBytes: RealTiktoken['decode_single_token_bytes'];
  tokenByteValues: RealTiktoken['token_byte_values'];
  name: RealTiktoken['name'];

  // used for counting tokens in chat prompts
  chatTokenRules?: {
    encoding: TiktokenEncoding;
    perMessage: number;
    perName: number;
  };

  /** Count tokens in a string. */
  count(message: string): number;
  /** Count tokens in a GPTMessage. */
  countGPTMessage(message: GPTMessage): number;
  /** Count all tokens that would be charged for input in a chat generation. */
  countGPTChatPrompt(options: {
    messages: GPTMessage[];
    functions?: { name: string; parameters: any; description: string }[];
  }): number;
}

const modelToEncoding = {
  'text-davinci-003': 'p50k_base',
  'text-davinci-002': 'p50k_base',
  'text-davinci-001': 'r50k_base',
  'text-curie-001': 'r50k_base',
  'text-babbage-001': 'r50k_base',
  'text-ada-001': 'r50k_base',
  davinci: 'r50k_base',
  curie: 'r50k_base',
  babbage: 'r50k_base',
  ada: 'r50k_base',
  'code-davinci-002': 'p50k_base',
  'code-davinci-001': 'p50k_base',
  'code-cushman-002': 'p50k_base',
  'code-cushman-001': 'p50k_base',
  'davinci-codex': 'p50k_base',
  'cushman-codex': 'p50k_base',
  'text-davinci-edit-001': 'p50k_edit',
  'code-davinci-edit-001': 'p50k_edit',
  'text-embedding-ada-002': 'cl100k_base',
  'text-similarity-davinci-001': 'r50k_base',
  'text-similarity-curie-001': 'r50k_base',
  'text-similarity-babbage-001': 'r50k_base',
  'text-similarity-ada-001': 'r50k_base',
  'text-search-davinci-doc-001': 'r50k_base',
  'text-search-curie-doc-001': 'r50k_base',
  'text-search-babbage-doc-001': 'r50k_base',
  'text-search-ada-doc-001': 'r50k_base',
  'code-search-babbage-code-001': 'r50k_base',
  'code-search-ada-code-001': 'r50k_base',
  gpt2: 'gpt2',
  'gpt-3.5-turbo': 'cl100k_base',
  'gpt-3.5-turbo-0301': 'cl100k_base',
  'gpt-3.5-turbo-0613': 'cl100k_base',
  'gpt-3.5-turbo-16k': 'cl100k_base',
  'gpt-3.5-turbo-16k-0613': 'cl100k_base',
  'gpt-4': 'cl100k_base',
  'gpt-4-0314': 'cl100k_base',
  'gpt-4-0613': 'cl100k_base',
  'gpt-4-32k': 'cl100k_base',
  'gpt-4-32k-0314': 'cl100k_base',
  'gpt-4-32k-0613': 'cl100k_base',
} as const;

const chatTokenRules: Record<
  string,
  {
    encoding: TiktokenEncoding;
    perMessage: number;
    perName: number;
  }
> = {
  'gpt-3.5': {
    encoding: 'cl100k_base',
    perMessage: 4, // every message follows {role/name}\n{content}\n
    perName: -1, // if there's a name, the role is omitted
  },
  'gpt-4': {
    encoding: 'cl100k_base',
    perMessage: 3,
    perName: 1,
  },
};

const loaded = new Set<any>();
const map = new Map<string, WeakRef<any>>();
const encodingRegistry = new FinalizationRegistry<{ tiktoken: RealTiktoken; key?: string }>(
  ({ tiktoken, key }) => {
    if (key) {
      map.delete(key);
    }
    tiktoken.free();
  }
);

export function keepTokenizerLoaded(encoderOrModel: TiktokenEncoding | ChatModel | TextModel) {
  const key = modelToEncoding[encoderOrModel as any] ?? encoderOrModel;
  const existing = map.get(key)?.deref();
  if (existing) {
    loaded.add(existing);
  } else {
    const encoder = getTokenizer(key);
    loaded.add(encoder);
  }
}

const TiktokenExtendedPrototype = {
  count(this: Tiktoken, message: string) {
    return this.encode(message).length;
  },
  countGPTMessage(this: Tiktoken, message: GPTMessage) {
    const rules = this.chatTokenRules;
    if (!rules) {
      throw new Error('Tokenizer does not have chat token rules');
    }
    if (message.content) {
      return (
        rules.perMessage +
        (message.name ? rules.perName + this.count(message.name) : 0) +
        this.count(message.content)
      );
    } else if (message.function_call) {
      const { name, arguments: args } = message.function_call;
      return this.count(name) + this.count(args) + rules.perMessage;
    } else {
      throw new Error('TODO: Not sure how to count tokens for this message type');
    }
  },
  countGPTChatPrompt(this: Tiktoken, { messages, functions }: any) {
    const rules = this.chatTokenRules;
    if (!rules) {
      throw new Error('Tokenizer does not have chat token rules');
    }
    return (
      messages.reduce((acc, message) => acc + this.countGPTMessage(message), 0) +
      (functions
        ? functions?.reduce((acc, fn) => {
            acc += this.count(fn.name);
            if (fn.description) acc += this.count(fn.description) + 3;
            acc += this.count(JSON.stringify(fn.parameters.properties));
            acc += 6;
            return acc;
          }, 0) +
          rules.perMessage +
          12
        : 0) +
      3
    );
  },
};

export function getTokenizer(
  encodingOrModel: TiktokenEncoding | ChatModel | TextModel,
  extraTokens?: Record<string, number>
): Tiktoken {
  const model = modelToEncoding[encodingOrModel] ?? encodingOrModel;
  if (!extraTokens) {
    var existing = map.get(model)?.deref();
    if (existing) {
      return existing;
    }
  }
  const t = get_encoding(model, extraTokens);
  const clone = {
    __proto__: TiktokenExtendedPrototype,
    encode: t.encode.bind(t),
    encodeOrdinary: t.encode_ordinary.bind(t),
    encodeWithUnstable: t.encode_with_unstable.bind(t),
    encodeSingleToken: t.encode_single_token.bind(t),
    decode: t.decode.bind(t),
    decodeSingleTokenBytes: t.decode_single_token_bytes.bind(t),
    tokenByteValues: t.token_byte_values.bind(t),
    name: t.name,
    chatTokenRules: encodingOrModel.startsWith('gpt-3.5')
      ? chatTokenRules['gpt-3.5']
      : encodingOrModel.startsWith('gpt-4')
      ? chatTokenRules['gpt-4']
      : undefined,
  };
  if (extraTokens) {
    encodingRegistry.register(clone, { tiktoken: t, key: undefined });
  } else {
    encodingRegistry.register(clone, { tiktoken: t, key: model });
    map.set(model, new WeakRef(clone));
  }
  return clone as any;
}

export function countTokens(model: ChatModel | TextModel, text: string) {
  return getTokenizer(model).count(text);
}
