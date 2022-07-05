import type { Awaitable } from '@davecode/types';

/** Returns a promise that resolves after `ms` milliseconds, essentially a Promisified `setTimeout` */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Returns an array containing a promise and two functions to resolve and reject that promise. */
export function deferred<T>(): [Promise<T>, (x: T) => void, (err: any) => void] {
  let resolve!: (x: T) => void;
  let reject!: (err: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, resolve, reject];
}

export function asyncMap<T, R>(input: Iterable<T>, mapper: (item: T, i: number) => Awaitable<R>) {
  return Promise.all([...input].map(mapper));
}
