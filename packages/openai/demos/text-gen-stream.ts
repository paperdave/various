import { generateTextCompletion } from '../src/text';

const stream = await generateTextCompletion({
  model: 'ada',
  prompt: '',
  stream: true,
  max_tokens: 500,
  temperature: 2,
});

for await (const text of stream.content) {
  // @ts-ignore
  process.stdout.write(text);
}

// @ts-ignore
process.stdout.write('\n\n');

console.log(await stream.data);
