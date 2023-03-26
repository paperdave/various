import { generateTextCompletion } from '../src/text';

const stream = await generateTextCompletion({
  model: 'ada',
  prompt: 'say this is a test.',
  stream: true,
  max_tokens: 10,
  temperature: 1.25,
});

for await (const text of stream.content) {
  // @ts-ignore
  process.stdout.write(text);
}

// @ts-ignore
process.stdout.write('\n\n');

console.log(await stream.data);
