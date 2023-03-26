export async function asyncIterToArray<T>(
  iterator: AsyncIterator<T> | AsyncIterable<T>
): Promise<T[]> {
  const iter = (iterator as AsyncIterable<T>)[Symbol.asyncIterator]?.() ?? iterator;
  const result: T[] = [];
  let latest = await iter.next();
  while (!latest.done) {
    result.push(latest.value);
    latest = await iter.next();
  }
  return result;
}

export function iterToArray<T>(iterator: Iterator<T> | Iterable<T>): T[] {
  const iter = (iterator as Iterable<T>)[Symbol.iterator]?.() ?? iterator;
  const result: T[] = [];
  let latest = iter.next();
  while (!latest.done) {
    result.push(latest.value);
    latest = iter.next();
  }
  return result;
}

export class IterableStream<T> implements AsyncIterableIterator<T> {
  #buffer: T[] = [];
  #listeners = new Set<{
    resolve(value: IteratorResult<T>): void;
    reject(error: any): void;
  }>();
  #ended = false;

  constructor() {}

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }

  async next(): Promise<IteratorResult<T>> {
    if (this.#buffer.length > 0) {
      return { done: false, value: this.#buffer.shift()! };
    }
    if (this.#ended) {
      return { done: true, value: undefined };
    }
    return new Promise((resolve, reject) => this.#listeners.add({ resolve, reject }));
  }

  push(value: T) {
    if (this.#listeners.size > 0) {
      const listeners = [...this.#listeners];
      this.#listeners.clear();
      for (const listener of listeners) {
        listener.resolve({ done: false, value });
      }
    } else {
      this.#buffer.push(value);
    }
  }

  async throw(error: any) {
    this.#buffer = [];
    for (const listener of this.#listeners) {
      listener.reject(error);
    }
    this.#listeners.clear();
    return { done: true, value: undefined } as IteratorResult<T>;
  }

  end() {
    this.#ended = true;
    if (this.#listeners.size > 0) {
      for (const listener of this.#listeners) {
        listener.resolve({ done: true, value: undefined });
      }
      this.#listeners.clear();
    }
  }
}

export function streamToIter<T>(
  readable: ReadableStream<T> | ReadableStreamReader<T>
): AsyncIterableIterator<T> {
  const reader = readable instanceof ReadableStream ? readable.getReader() : readable;
  return {
    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
      return this;
    },
    async next() {
      return reader.read() as Promise<IteratorResult<T>>;
    },
    async return() {
      reader.releaseLock();
      return { done: true, value: undefined };
    },
  };
}
