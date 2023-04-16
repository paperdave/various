import { describe, expect, it } from 'bun:test';
import { createArray } from './array';
import { memoize } from './memoize';

describe('memoize', () => {
  it('only calls once', () => {
    let called = 0;
    const fn = memoize((i: string) => {
      called++;
      return i.toUpperCase();
    });

    expect(fn('a')).toBe('A');
    expect(fn('a')).toBe('A');
    expect(fn('a')).toBe('A');
    expect(called).toBe(1);
    expect(fn('b')).toBe('B');
    expect(called).toBe(2);

    const fn2 = memoize((i: string) => Math.random());
    expect(fn2('a')).toBe(fn2('a'));
    expect(fn2('b')).toBe(fn2('b'));
  });

  it('can clear and mess with cache', () => {
    let called = 0;
    const fn = memoize((i: string) => {
      called++;
      return i.toUpperCase();
    });
    expect(fn('a')).toBe('A');
    expect([...fn.cache.entries()]).toEqual([['a', 'A']]);
    expect(called).toBe(1);
    fn.cache.clear();
    expect(fn('a')).toBe('A');
    expect(called).toBe(2);
  });

  it('can use custom cache', () => {
    const cache = new Map();
    const fn = memoize({
      execute: (i: string) => i.toUpperCase(),
      cache,
    });
    const fn2 = memoize({
      execute: (i: string) => i.toLowerCase(),
      cache,
    });
    expect(fn('a')).toBe('A');
    expect(fn2('a')).toBe('A');
    expect(cache).toBe(cache);
    cache.set('a', 'b');
    expect(fn('a')).toBe('b');
    expect(fn2('a')).toBe('b');
  });

  it('async', async () => {
    let called = 0;
    const fn = memoize(async (i: string) => {
      called++;
      return i.toUpperCase();
    });
    expect(await fn('a')).toBe('A');
    expect(await fn('a')).toBe('A');
    expect(await fn('a')).toBe('A');
    expect(called).toBe(1);
  });

  it('async at once', async () => {
    let called = 0;
    const fn = memoize(async (i: string) => {
      called++;
      return i.toUpperCase();
    });
    expect(await Promise.all(createArray(10, () => fn('a')))).toEqual(createArray(10, () => 'A'));
    expect(called).toBe(1);
  });

  it('getKey', () => {
    const fn = memoize({
      execute: (i: string, key: string) => i.toUpperCase(),
      getKey: (_: string, key: string) => key,
    });
    expect(fn('a', 'a')).toBe('A');
    expect(fn('b', 'a')).toBe('A');
    expect(fn('b', 'b')).toBe('B');
    expect(fn('a', 'b')).toBe('B');
  });
});
