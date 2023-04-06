import { fetchOpenAI, FetchOptions } from './fetch';
import { TextEditModel } from './models';
import { CompletionUsage, RawCompletionUsage } from './shared';

export interface TextEditOptions<N extends number = number> extends FetchOptions {
  model: TextEditModel;
  input?: string;
  instruction: string;

  temperature?: number;
  topP?: number;
  n?: N;

  user?: string;
}

interface RawTextEdit {
  object: 'edit';
  created: number;
  choices: RawTextEditChoice[];
  usage: RawCompletionUsage;
}

interface RawTextEditChoice {
  text: string;
  index: number;
}

export interface TextEdit {
  content: string;
  created: Date;
  model: TextEditModel;
  usage: CompletionUsage;
}

export interface TextEditMulti {
  choices: string[];
  created: Date;
  model: TextEditModel;
  usage: CompletionUsage;
}

export type TextEditResultFromOptions<N extends number = 1> = 1 extends N
  ? TextEdit
  : TextEditMulti;

export async function generateTextEdit<N extends number>(
  options: TextEditOptions<N>
): Promise<TextEditResultFromOptions<N>> {
  const { model, input, instruction, temperature, topP, n, auth, retry } = options;
  const response = await fetchOpenAI({
    endpoint: '/edits',
    method: 'POST',
    body: {
      model,
      input,
      instruction,
      temperature,
      top_p: topP ?? (options as any).top_p,
      n,
    },
    auth,
    retry,
  });

  const json = (await response.json()) as RawTextEdit;

  return {
    ...(n === 1
      ? {
          content: json.choices[0].text,
        }
      : {
          choices: json.choices.map(choice => choice.text),
        }),
    created: new Date(json.created * 1000),
    model,
    usage: {
      promptTokens: json.usage.prompt_tokens,
      completionTokens: json.usage.completion_tokens,
      totalTokens: json.usage.total_tokens,
      price: 0, // beta is free
    },
  } as TextEditResultFromOptions<N>;
}
