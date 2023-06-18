# @paperdave/openai

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: WIP" src="https://img.shields.io/badge/status-wip-yellow"></a>
<a href="https://www.npmjs.com/package/@paperdave/openai"><img alt="NPM Version" src="https://img.shields.io/npm/v/@paperdave/openai.svg?label=latest%20release"></a>
</div>
<br>

This is a TypeScript library for interacting with the [OpenAI API](https://platform.openai.com/docs/introduction/overview). It provides smart and easy to use abstractions over the API that make tasks like [streaming](#streaming-messages) and [AI function calling](#function-calling) much easier to use.

**Example: Generating a Chat Completion with GPT-4**:

```ts
import { GPTMessage, generateChatCompletion } from '@paperdave/openai';

const messages: GPTMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Write me a poem about TypeScript' }
];

const completion = await generateChatCompletion({
  model: 'gpt-4',
  messages,
});

console.log(completion.content);
```

Pass `stream: true` to get an async iterator and replicate the "ChatGPT typing" effect.

```ts
const completion = await generateChatCompletion({
  model: 'gpt-4',
  messages,
  stream: true,
});

for await (const token of completion.tokens) {
  if (token.type === 'text') {
    process.stdout.write(token.value);
  }
}
process.stdout.write('\n');
```

## Authentication

By default, this library reads your api key and organization from the `OPENAI_API_KEY` and `OPENAI_ORGANIZATION` environment variables. **If using Node.js, you may need to use [dotenv](https://www.npmjs.com/package/dotenv) to load a `.env` file**. You can override this with your own via `setAPIKey` and `setOrganization`, or override them per-request by passing a separate `auth` object to most functions.

```ts
import { setAPIKey, setOrganization, generateChatCompletion } from '@paperdave/openai';

setAPIKey('MY_OWN_TOKEN');
setOrganization('MY_ORG_ID');

// Per-request
generateChatCompletion({
  auth: {
    apiKey: 'SECOND_TOKEN',
    organization: 'OTHER_ID',
  },
  ...
});
```

The thinking behind authentication being a global is simply that most apps will not be using more than one token.

## Chat Completions

Chat completions allow you to build conversational AI, similar to ChatGPT. [OpenAI's Guide](https://platform.openai.com/docs/guides/chat/introduction)

One function is given to call this api: `generateChatCompletion`, which has a dynamic type based on the arguments given to it.

```ts
const response = await generateChatCompletion({
  // Required arguments, see OpenAI Docs
  model: ChatModel,
  messages: GPTMessage[]

  // Optionally provide callable functions, see below
  functions: Record<string, ChatCompletionFunctionOption>,

  // Optionally override API key and organization.
  auth: AuthOverride,
  // Number of times to retry due to network/ratelimit issues, default 3
  retry: number,

  // Optional: See OpenAI Docs
  stream: boolean,
  maxTokens: number,
  temperature: number,
  topP: number,
  n: number,
  stop: string | string[],
  presencePenalty: number,
  frequencyPenalty: number,
  bestOf: number,
  logitBias: Record<string, number>,
  user: string,
});
```

If `stream` is set to false (the default), you'll get an object like this:

```ts
interface ChatCompletion {
  content: string;
  finishReason: FinishReason; // (string enum)
  created: Date;
  model: ChatModel; // (string enum)
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    price: number; // (in us dollars)
  };
}
```

### Streaming Messages

If stream is set to true, you will get an async iterator with a promise to the full data instead:

```ts
interface ChatCompletionStream {
  content: AsyncIterableIterator<ChatCompletionStreamToken>;
  data: Promise<ChatCompletion>;
}

interface ChatCompletionStreamToken {
  type: 'text' | 'function_call' | 'function_result';

  // type=text
  value: string;

  // type=function_call
  name: string;
  arguments: any;

  // type=function_result
  name: string;
  result: any;
}
```

Once the full stream is consumed, `data` will have resolved. It should be noted that right now token counting with streams does not work.

```ts
const stream = await generateChatCompletion({
  model: 'gpt-4',
  messages,
  stream: true,
});

for await (const token of stream.content) {
  process.stdout.write(token);
}
process.stdout.write('\n');

const data = await stream.data;

console.log(`The above message cost $${data.usage.price.toFixed(3)}`);
```

### Function Calling

As of June 13th, OpenAI announced [new models that support function calling](https://openai.com/blog/function-calling-and-other-api-updates), which works similar to ChatGPT Plugins. This works by providing a list of functions, and the API may respond with a function call instead of a text output. However, when using `generateChatCompletion`, this is fully abstracted away and you can pass real function references:

```ts
import z from 'zod';
import { generateChatCompletion, GPTMessage } from '@paperdave/openai';

const messages: GPTMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is the weather in nyc like?' },
];

const functions = {
  weather: {
    description: 'Get the current weather in a given location',

    params: z.object({
      location: z.string().describe('The city and state, e.g. New York, NY'),
      unit: z
        .enum(['imperial', 'metric'])
        .default('imperial')
        .describe('The unit of measurement for the temperature'),
    }),

    // Defining the function is optional (see below)
    async run({ location, unit }) {
      // in your app, you would make this call to a weather API
      console.log(`Getting weather for ${location} in ${unit} units...`);
      return {
        temperature: 72,
        unit,
        location,
        forecast: ['sunny', 'windy'],
      };
    },
  },
};

const result = await generateChatCompletion({
  model: 'gpt-3.5-turbo-0613',
  messages,
  functions,
});

console.log(result.content);
```

Parameters are defined and validated with [zod](https://www.npmjs.com/package/zod). OpenAI says they support any JSON schema, but it may be best practice to only have an object with top level properties. If a `run` function is provided on all functions, `generateChatCompletion` will always return a chat reply in `.content`. Otherwise, there is a possibility it will return `.content = null` and `.function = {...}`.

This works with streaming too:

```ts
const result = await generateChatCompletion({
  model: 'gpt-3.5-turbo-0613',
  messages,
  functions,
  stream: true,
});

for await (const token of result.tokens) {
  if (token.type === 'text') {
    process.stdout.write(token.value);
  } else {
    // this will be run twice, once with the function call, and once with the result
    console.log();
    console.log(token);
  }
}
```

### Multiple generations

**I don't recommend using the `n` option, but instead just make multiple calls to the OpenAI API.**

When you set `n` to more than 1, you are given a `choices` array instead of a single property `content`. Here are what the types look like in this case:

```ts
interface ChatCompletionMulti {
  choices: ChatCompletionChoice[];
  created: Date;
  model: ChatModel; // (string enum)
  usage: ChatCompletionUsage;
}

interface ChatCompletionChoice {
  content: string | null;
  function: ChatCompletionFunction | null;
  finishReason: FinishReason; // (string enum)
}

interface ChatCompletionMultiStream {
  choices: AsyncIterableIterator<ChatCompletionStreamToken>[];
  data: Promise<ChatCompletionMulti>;
}
```

This isnt supported when using functions yet.

## Text Completions / Insertions

Text completions allow you to complete a text prompt. This form of GPT's API seems to be pushed away in favor of Chat Completions, with newer models only being supported there. [OpenAI's Guide](https://platform.openai.com/docs/guides/completion)

One function is given to call this api: `generateTextCompletion`, which functions almost identically to `generateChatCompletion`, except that instead of a `messages` array, you pass a `prompt` string.

```ts
import { generateTextCompletion } from '@paperdave/openai';

const response = await generateTextCompletion({
  // Required arguments, see OpenAI Docs
  model: TextModel,
  prompt: string,

  // Optionally override API key and organization.
  auth: AuthOverride,
  // Number of times to retry due to network/ratelimit issues, default 3
  retry: number,

  // Optional: See OpenAI Docs
  suffix: string,
  max_tokens: number,
  temperature: number,
  topP: number,
  n: number,
  logProbs: number,
  stop: string | string[],
  echo: boolean,
  presencePenalty: number,
  frequencyPenalty: number,
  bestOf: number,
  logitBias: Record<string, number>,
  user: string,
});
```

The return type is almost identical to `generateChatCompletion`. To understand exactly how it works and how to stream results, see the [Chat Completions](#chat-completions) section above.

In addition, you can pass `logProbs: number` to get a `logProbs` object on the response.

## Text Edits

The edits endpoint can be used to edit text, rather than just completing it. [OpenAI's Guide](https://platform.openai.com/docs/guides/completion/editing-text)

Editing text is done with the `generateTextEdit` function, which accepts the following arguments:

```ts
import { generateTextEdit } from '@paperdave/openai';

const response = await generateTextEdit({
  // Required arguments, see OpenAI Docs
  model: TextEditModel,
  input?: string,
  instruction: string,

  // Optionally override API key and organization.
  auth: AuthOverride,
  // Number of times to retry due to network/ratelimit issues, default 3
  retry: number,

  // Optional: See OpenAI Docs
  temperature: number,
  topP: number,
  n: number,
  // user: string, // OpenAI should have this, but they dont
});
```

Other than the lack of streaming, the return type is nearly identical to `generateChatCompletion`. To understand exactly how it works, see the [Chat Completions](#chat-completions) section above.

## Images

### Image Generation

Coming Soon

### Image Editing

Coming Soon

### Image Variations

Coming Soon

## Embeddings

Coming Soon

## Audio

Coming Soon

## Files

Coming Soon

## Fine-Tuning

Coming Soon

## Moderation

OpenAI has a tool for checking whether content complies with their usage policies. [OpenAI's Guide](https://platform.openai.com/docs/guides/moderation)

There isn't much to say about this endpoint.

```ts
import { generateModeration } from '@paperdave/openai';

const mod = await generateModeration({
  input: 'JavaScript is a good programming language.',
});

// false, even though the statement is not true
console.log(mod.flagged);
```

## Counting Tokens

This package includes a modified api to access `tiktoken`, the method for tokenizing strings. This is exposed as `getTokenizer(modelOrEncodingName)`, which returns a tokenizer that contains many helpful methods:

```ts
import { getTokenizer } from '@paperdave/openai';

const tokenizer = getTokenizer('gpt-3.5-turbo'); // or the underlying encoding "cl100k_base"

console.log(tokenizer.count('Hello, world!')); // 4
```

The method `countGPTChatPrompt` takes in `{ messages, functions }` and returns the number of tokens that `usage.promptTokens` would be.

> **Note**: I have not fully nailed down the counting algorithm for functions. It currently overcounts by 1 or 2 tokens in some situations.

### Tokenizer Memory Management

Tokenizers are automatically garbage collected, which can lead to slowdowns if garbage collection and GPT tasks are run too often. You can keep a tokenizer loaded by calling `keepTokenizerLoaded` with the model or encoding name.

```ts
keepTokenizerLoaded('cl100k_base'); // GPT-3 and 4
```

This is not done by default because it intentionally creates a memory leak by keeping the tokenizer loaded in memory.
