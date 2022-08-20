/* eslint-disable no-console */
// when i run this i use "2> /dev/null" and i mod STDOUT to be 2 instaed of 1
import { group, bench, run } from 'mitata';
import { info } from './dist/index.js';

const obj = {
  object: { hi: true },
  array: ['a', 'b', 'c'],
  number: 1,
  string: 'hello',
  boolean: true,
};

const runtime = process.isBun ? 'bun' : 'node';

group('hello world', () => {
  bench(runtime + ' console', () => {
    console.error('hello world');
  });
  bench('@paperdave/logger', () => {
    info('hello world');
  });
});

group('formatting a string with %s and %d', () => {
  bench(runtime + ' console', () => {
    console.error('hello %s, %d', 'world', 1);
  });
  bench('@paperdave/logger', () => {
    info('hello %s, %d', 'world', 1);
  });
});

group('printing an object', () => {
  bench(runtime + ' console', () => {
    console.error(obj);
  });
  bench('@paperdave/logger', () => {
    info(obj);
  });
});

await run();
