// @ts-nocheck
import z from 'zod';
import { generateChatCompletion, GPTMessage } from '@paperdave/openai';

const messages: GPTMessage[] = [
  // { role: 'system', content: '' },
  { role: 'user', content: 'hello' },
];

const functions = {
  '1': {
    params: z.object({}),
  },
  a: {
    description: '2',
    params: z.object({}),
  },
};

const result = await generateChatCompletion({
  model: 'gpt-3.5-turbo-0613',
  messages,
  functions,
});

console.log(result);
