import { generateChatCompletion, GPTMessage } from '@paperdave/utils';

const messages: GPTMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Write a short poem about TypeScript' },
];

const stream = await generateChatCompletion({
  model: 'gpt-4',
  messages,
  stream: true,
});

// Stream each token as it is generated.
for await (const text of stream.content) {
  process.stdout.write(text);
}

console.log('\n\n', await stream.data); // metadata from generation
