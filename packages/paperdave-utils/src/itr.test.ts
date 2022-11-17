import { deepEqual } from 'assert';
import { describe, test } from 'bun:test';
import { IterableStream } from './iterator';
import { AsyncIt } from './itr';

describe('itr', () => {
  describe('async', () => {
    test('map', async () => {
      const stream = new IterableStream<number>();

      stream.push(1);
      stream.push(2);
      stream.push(3);
      stream.end();

      const mappedValues = await new AsyncIt(stream) //
        .map(value => value * 2)
        .map(x => x.toString())
        .array();

      deepEqual(mappedValues, ['2', '4', '6']);
    });
  });
});
