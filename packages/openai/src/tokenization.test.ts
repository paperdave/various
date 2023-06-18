import * as models from './models';
import * as tokenizer from './tokenization';
import { unique } from '@paperdave/utils';
import { expect, test } from 'bun:test';

const modelNames = unique([
  ...Object.keys(models.PRICING_CHAT),
  ...Object.keys(models.PRICING_TEXT),
]);

for (const name of modelNames) {
  test(`model ${name} has a tokenizer`, () => {
    const x = tokenizer.getTokenizer(name as any);
    expect(x.encode('Hello world!').length).toBeGreaterThan(0);
  });
}

test('ai function call metadata counting', () => {
  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(
    t.countGPTChatPrompt({
      messages: [],
      functions: [
        {
          name: 'weather',
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. New York, NY',
              },
              unit: {
                type: 'string',
                enum: ['imperial', 'metric'],
                default: 'imperial',
                description: 'The unit of measurement for the temperature',
              },
            },
            required: ['location'],
          },
        },
      ],
    })
  ).toBe(78);
});
test('ai function call response', () => {
  const message = {
    role: 'assistant',
    content: null,
    function_call: {
      name: 'weather',
      arguments: '{\n  "location": "New York, NY"\n}',
    },
  } as const;

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTMessage(message)).toBe(17);
});
test('sample chat 1', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'sgdhjf fds a 38291321 fdsaf',
      },
    ],
    functions: [
      {
        name: 'jjjjjjjjjjjjjjjjjjjjjjjj',
        description: '88888 fdfjd dasjf',
        parameters: {
          type: 'object',
          properties: {
            aaaaaaaaa: {
              type: 'string',
              description: 'five five five five five five',
            },
          },
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(78);
});
test('sample chat 2', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'sgdhjf fds a 38291321 fdsaf',
      },
    ],
    functions: [
      {
        name: 'jjjjjjjjjjjjjjjjjjjjjjjj',
        description: '88888 fdfjd dasjf',
        parameters: {
          type: 'object',
          properties: {
            aaaaaaaaa: {
              type: 'string',
            },
          },
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(70);
});
test('sample chat 3', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'sgdhjf fds a 38291321 fdsaf',
      },
    ],
    functions: [
      {
        name: 'jjjjjjjjjjjjjjjjjjjjjjjj',
        description: '88888 fdfjd dasjf',
        parameters: {
          type: 'object',
          properties: {
            aaaaaaaaa: {
              type: 'string',
              description: '0',
            },
          },
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(74);
});
test('sample chat 3', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'hello',
      },
    ],
    functions: [
      {
        name: 'a',
        description: '',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(31);
});
test('sample chat 4', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'hello',
      },
    ],
    functions: [
      {
        name: 'a',
        description: 'a',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(35);
});
test('sample chat 5', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'hello',
      },
    ],
    functions: [
      {
        name: 'a',
        description: '0',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'b',
        description: '0',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(46);
});
test('sample chat 6', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'hello',
      },
    ],
    functions: [
      {
        name: '1',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'a',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(39);
});
test('sample chat 7', () => {
  const data = {
    messages: [
      {
        role: 'user',
        content: 'hello',
      },
    ],
    functions: [
      {
        name: '1',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };

  const t = tokenizer.getTokenizer('gpt-3.5-turbo-0613');
  expect(t.countGPTChatPrompt(data)).toBe(32);
});
