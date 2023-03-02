import { asyncIterToArray } from './iterator';

/** Iterator utility library. Status: EXPERIMENTAL. */
export class AsyncIt<T> implements AsyncIterableIterator<T> {
  constructor(private readonly iterator: AsyncIterableIterator<T>) {
    if (iterator.return) {
      (this as any).return = iterator.return.bind(iterator);
    }
    if (iterator.throw) {
      (this as any).throw = iterator.throw.bind(iterator);
    }
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  async next() {
    return this.iterator.next();
  }

  async array() {
    return asyncIterToArray(this);
  }

  private async *_map(fn: (value: T, index: number) => any) {
    let i = 0;
    for await (const value of this) {
      yield fn(value, i++);
    }
  }

  map<V>(fn: (value: T, index: number) => V): AsyncIt<V> {
    return new AsyncIt(this._map(fn));
  }
}
