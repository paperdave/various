import { describe, expect, it } from 'bun:test';
import { Queue } from './queue';

describe('queue', () => {
  it('works', () => {
    const q = new Queue();
    expect(q).toEqual([]);
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    expect(q).toEqual([1, 2, 3]);
    expect(q.peek()).toBe(1);
    expect(q.dequeue()).toBe(1);
    expect(q).toEqual([2, 3]);
    expect(q.dequeue()).toBe(2);
    expect(q).toEqual([3]);
    expect(q.dequeue()).toBe(3);
    expect(q).toEqual([]);
    expect(q.dequeue()).toBe(undefined);
    expect(q.dequeue()).toBe(undefined);
  });
});
