import { delay } from './promise';
import { Queue, queuedFunction, QueuedFunctionItem } from './queue';

const queue = new Queue<QueuedFunctionItem>();

const fn = queuedFunction({
  queue,
  async execute(key: string, wait: number) {
    console.log('Start function ' + key);
    await delay(wait);
    console.log('End function ' + key);
  },
});

const fn2 = queuedFunction({
  queue,
  async execute(key: string, wait: number) {
    console.log('Start function2 ' + key);
    await delay(wait);
    console.log('End function2 ' + key);
  },
});

fn('a', 1000);
fn2('b', 500);
fn('c', 2000);

console.log(queue);
