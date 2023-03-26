// @ts-nocheck
import ansi from 'ansi-styles';
import chalk from 'chalk';
import dedent from 'dedent';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateChatCompletion, GPTMessage } from '../src/chat';

if (process.argv.length <= 2) {
  console.log('Usage: ' + path.basename(process.argv[1]) + ' [your question]');
  process.exit(1);
}

const platform =
  {
    linux: 'Linux',
    darwin: 'MacOS',
    win32: 'Windows',
  }[process.platform] ?? process.platform;

const messages: GPTMessage[] = [
  {
    role: 'system',
    content: dedent`
      You are a command-line assistant for a ${platform} system with ${os.release()} ${os.arch()}. Respond only with valid bash shell script, keeping all other text are hash comments on separate lines. Reduce explanations, and omit explanations for extremely simple commands.

      Files in cwd "${process.cwd()}": ${fs.readdirSync('.').join(', ')}
    `,
  },
  {
    role: 'user',
    content: process.argv.slice(2).join(' '),
  },
];

const stream = await generateChatCompletion({
  model: 'gpt-3.5-turbo',
  messages,
  stream: true,
});

let state = 'none';

for await (const text of stream.content) {
  if (state === 'none') {
    if (text.trim().startsWith('#')) {
      process.stdout.write(ansi.greenBright.open);
      state = 'comment';
    } else if (text.trim().startsWith('#')) {
      process.stdout.write(ansi.whiteBright.open + '$ ');
      state = 'code';
    }
  }

  process.stdout.write(
    text.replace(/\n/g, () => {
      state = 'none';
      return `\n${ansi.reset.close}`;
    })
  );
}

process.stdout.write('\n');
process.stdout.write(
  chalk.cyanBright('run this code? ') +
    chalk.underline('Y') +
    '/' +
    chalk.underline('N') +
    'o/' +
    chalk.underline('E') +
    'xplain '
);

setTimeout(() => {}, 100000);
