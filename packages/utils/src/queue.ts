import { deferred } from './promise';
import { Func } from './types';

export interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  peek(): T | undefined;
  length: number;
}

export class Queue<T> extends Array {
  constructor(items?: T[]) {
    super();
    if (items) {
      this.push(...items);
    }
  }

  peek(): T | undefined {
    return this[0];
  }
}
export interface Queue<T> extends IQueue<T> {}
Queue.prototype.enqueue = Array.prototype.push;
Queue.prototype.dequeue = Array.prototype.shift;

export type QueuedFunctionItem =
  | [fn: Func<Promise<any>>, resolve: Func, reject: Func, args: any[]]
  | [true];

export interface QueuedFunctionOptions<Args extends unknown[], Ret> {
  queue?: IQueue<QueuedFunctionItem> | ((...args: Args) => IQueue<QueuedFunctionItem> | string);
  execute(...args: Args): Promise<Ret>;
}

export function queuedFunction<Args extends unknown[], Ret>(
  options: QueuedFunctionOptions<Args, Ret> | ((...args: Args) => Promise<Ret>)
) {
  const fn = typeof options === 'function' ? options : options.execute;
  const queue =
    typeof options === 'function'
      ? new Queue<QueuedFunctionItem>()
      : options.queue ?? new Queue<QueuedFunctionItem>();
  const queueMap =
    typeof queue === 'function' ? new Map<string, IQueue<QueuedFunctionItem>>() : null;
  const getQueue = (args: Args) => {
    if (typeof queue === 'function') {
      const key = queue(...args);
      if (typeof key === 'string') {
        let item = queueMap!.get(key);
        if (!item) {
          item = new Queue();
          queueMap!.set(key, item);
        }
        return item;
      }
      return key;
    } else return queue!;
  };
  const next = (queue: IQueue<QueuedFunctionItem>) => {
    queue.dequeue();
    const value = queue.peek();
    if (!value || value[0] === true) return;
    const [fn, resolve, reject, args] = value;
    (value as any)[0] = true;
    fn(...args)
      .then(resolve)
      .catch(reject)
      .finally(() => next(queue));
  };
  return (...args: Args) => {
    const queue = getQueue(args);
    if (queue.length === 0) {
      queue.enqueue([true]);
      return fn(...args).finally(() => next(queue));
    }
    const [promise, resolve, reject] = deferred<Ret>();
    queue.enqueue([fn as any, resolve, reject, args]);
    return promise;
  };
}
