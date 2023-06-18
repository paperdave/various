// @ts-nocheck
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
