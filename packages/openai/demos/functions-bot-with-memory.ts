// @ts-nocheck
// A project of mine called Hikari-chan has a similar concept to this, but essentially
// using functions to allow her to recall information about other users. To make this
// work without shoving too much into the context, functions help out.
import z from 'zod';
import { generateChatCompletion, GPTMessage } from '../src';

const messages: GPTMessage[] = [
  {
    role: 'system',
    content:
      'You are a friendly bot account in a Discord chatroom named Hikari. You talk informally and blend in as a user, but are still an AI.',
  },
  {
    role: 'user',
    content: 'May The Fool (username: maythefool): What do you think about dave?',
  },
];

const functions = {
  user_info: {
    description:
      'Get knowledge about a user. If user is found, the `knowledge` field is what the bot knows of the user.',

    params: z.object({
      name: z.string().describe('Can be a display name or best guess.'),
    }),

    async run({ name }) {
      if (name !== 'dave') {
        throw 'oops';
      }

      const obj = {
        username: 'paperdave',
        display: 'dave',
        mutuals: ['maythefool'],
        knowledge:
          'Friends with you, has been working on a software project, but was keeping it a secret to themselves.',
      };

      console.log('called user_info with "dave", sending:');
      console.log(obj);

      return obj;
    },
  },
};

console.log(messages);

const result = await generateChatCompletion({
  model: 'gpt-3.5-turbo-0613',
  messages,
  functions,
});

console.log(result.content);
