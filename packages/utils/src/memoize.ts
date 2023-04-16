import { Func } from './types';

export interface MemoizeOptions<
  T extends Func,
  Cache extends Map<string, ReturnType<Func>> = Map<string, ReturnType<Func>>
> {
  execute: T;
  cache?: Cache;
  getKey?(...args: Parameters<T>): string;
}

interface MemoizedFunction<
  T extends Func,
  Cache extends Map<string, ReturnType<Func>> = Map<string, ReturnType<Func>>
> {
  (...args: Parameters<T>): ReturnType<T>;
  cache: Cache;
  original: T;
}

const defaultGetKey = (...args: unknown[]) =>
  args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join('|');

/**
 * Caches results of a function calls, making it so calling the same function with the same
 * arguments will return the same result without re-evaluating.
 *
 * Supports async functions (you'll get a promise that resolves to the cached value), but does not
 * support functions that conditionally return a promise.
 */
export function memoize<T extends Func, C extends Map<string, ReturnType<T>>>(
  opts: T | MemoizeOptions<T, C>
): MemoizedFunction<T, C> {
  const fn = typeof opts === 'function' ? opts : opts.execute;
  const cache = (typeof opts === 'function' ? null : opts.cache) ?? new Map();
  const getKey = (typeof opts === 'function' ? null : opts.getKey) ?? defaultGetKey;

  const memoized = function (...args: Parameters<T>) {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    if (result instanceof Promise) {
      result.catch(() => cache.delete(key));
    }
    cache.set(key, result);

    return result;
  } as MemoizedFunction<T>;

  memoized.original = fn;
  memoized.cache = cache;

  return memoized as MemoizedFunction<T, C>;
}
