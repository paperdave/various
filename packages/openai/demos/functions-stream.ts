// @ts-nocheck
import z from 'zod';
import { generateChatCompletion, GPTMessage } from '../src';

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

    async run({ location, unit }) {
      // in your app, you would make this call to a weather API
      return {
        temperature: 72,
        unit,
        location,
        forecast: ['sunny', 'windy'],
      };
    },
  },
};

console.log(messages[1].content);
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
    console.log();
    console.log(token);
  }
}

console.log(await result.data);
