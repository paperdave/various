# @paperdave/openai

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: WIP" src="https://img.shields.io/badge/status-wip-yellow"></a>
<a href="https://www.npmjs.com/package/@paperdave/openai"><img alt="NPM Version" src="https://img.shields.io/npm/v/@paperdave/openai.svg?label=latest%20release"></a>
</div>
<br>

This library allows you to interact with the OpenAI API. Instead of being a simple wrapper like the official `openai` package, it is a smarter abstraction that makes developing AI tools in TypeScript much easier to do. It is currently a large work in progress, only covering some of the API.

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

for await (const token of completion.content) {
  process.stdout.write(token);
}
process.stdout.write('\n');
```

## Authentication

By default, this library reads your api key and organization from the `OPENAI_API_KEY` and `OPENAI_ORGANIZATION` environment variables. **If using Node.js, you may need to use [dotenv](https://www.npmjs.com/package/dotenv) to load a `.env` file**. You can override this with your own via `setAPIKey` and `setOrganization`, or override them per-request by passing a separate `auth` object to most functions.

```ts
import { setAPIKey, setOrganization, generateChatCompletion } from '@paperdave/openai';

setAPIKey('MY_OWN_TOKEN');
setOrganization('org-zVFQp7dWPYVEISqJjXw2QFzx');

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
  content: AsyncIterableIterator<string>;
  data: Promise<ChatCompletion>;
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

### Multiple generations

When you set `n` to more than 1, you are given a `choices` array instead of a single property `content`. Here are what the types look like in this case:

```ts
interface ChatCompletionMulti {
  choices: ChatCompletionChoice[];
  created: Date;
  model: ChatModel; // (string enum)
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    price: number; // (in us dollars)
  };
}

interface ChatCompletionChoice {
  content: string;
  finishReason: FinishReason; // (string enum)
}

interface ChatCompletionMultiStream {
  choices: AsyncIterableIterator<string>[];
  data: Promise<ChatCompletionMulti>;
}
```

## Text Completions / Insertions

Text completions allow you to complete a text prompt. [OpenAI's Guide](https://platform.openai.com/docs/guides/completion)

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

Coming Soon

## Counting Tokens

Implemented, Docs coming soon.
