import { encoding_for_model, get_encoding, TiktokenEncoding, TiktokenModel } from '@dqbd/tiktoken';
import { GPTMessage } from 'chat';
import { ChatModel, TextModel } from 'models';

const chatTokenRules: Record<
  string,
  {
    encoding: TiktokenEncoding;
    perMessage: number;
    perName: number;
  }
> = {
  'gpt-3.5-turbo-0301': {
    encoding: 'cl100k_base',
    perMessage: 4, // every message follows {role/name}\n{content}\n
    perName: -1, // if there's a name, the role is omitted
  },
  'gpt-4-0314': {
    encoding: 'cl100k_base',
    perMessage: 3,
    perName: 1,
  },
};
chatTokenRules['gpt-3.5-turbo'] = chatTokenRules['gpt-3.5-turbo-0301'];
chatTokenRules['gpt-4'] = chatTokenRules['gpt-4-0314'];
chatTokenRules['gpt-4-32k'] = chatTokenRules['gpt-4'];
chatTokenRules['gpt-4-32k-0314'] = chatTokenRules['gpt-4-0314'];

const modelAliases: Record<Exclude<ChatModel | TextModel, TiktokenModel>, TiktokenModel> = {
  'gpt-4-0314': 'gpt-4',
  'gpt-4-32k-0314': 'gpt-4',
};

export function getTokenizerForModel(
  model: ChatModel | TextModel,
  extraTokens?: Record<string, number>
) {
  return encoding_for_model(modelAliases[model] ?? model, extraTokens);
}

export function getTokenizer(encoding: TiktokenEncoding, extraTokens?: Record<string, number>) {
  return get_encoding(encoding, extraTokens);
}

export function countTokens(model: ChatModel | TextModel, text: string) {
  return encoding_for_model(modelAliases[model] ?? model).encode(text).length;
}

export function countChatPromptTokens(model: ChatModel, messages: GPTMessage[]): number {
  const { encoding, perMessage, perName } = chatTokenRules[model];
  const encoder = get_encoding(encoding);

  let count = 0;
  for (const message of messages) {
    count += perMessage;
    for (const [key, value] of Object.entries(message)) {
      count += encoder.encode(value).length;
      if (key === 'name') {
        count += perName;
      }
    }
  }

  count += 3; // every reply is primed with assistant

  return count;
}
