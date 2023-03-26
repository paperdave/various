// @ts-nocheck
import { generateChatCompletion, GPTMessage } from '../src/chat';

const messages: GPTMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Write a short poem about TypeScript' },
];

const stream = await generateChatCompletion({
  model: 'gpt-3.5-turbo',
  messages,
  stream: true,
});

for await (const text of stream.content) {
  process.stdout.write(text);
}

process.stdout.write('\n');

console.log(await stream.data);
