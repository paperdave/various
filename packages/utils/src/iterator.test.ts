import { describe, expect, test } from 'bun:test';
import { IterableStream } from './iterator';

describe('iterator', () => {
  describe('IterableStream', () => {
    test('ending early doesnt break', async () => {
      const stream = new IterableStream<number>();

      stream.push(1);
      stream.push(2);
      stream.push(3);
      stream.end();

      expect(await stream.next()).toEqual({ value: 1, done: false });
      expect(await stream.next()).toEqual({ value: 2, done: false });
      expect(await stream.next()).toEqual({ value: 3, done: false });
      expect(await stream.next()).toEqual({ value: undefined, done: true });
      expect(await stream.next()).toEqual({ value: undefined, done: true });
    });
  });
});
