// @ts-ignore
import { expect, it } from 'bun:test';
import { Emitter } from '.';

it('event functions are called', () => {
  let flag1 = 0;
  let flag2 = 0;

  const emitter = new Emitter();
  emitter.on('test', () => {
    flag1++;
  });
  emitter.on('cool', () => {
    flag2++;
  });

  emitter.emit('test');
  expect(flag1).toBe(1);

  emitter.emit('cool', 'data');
  expect(flag2).toBe(1);

  emitter.emit('test');
  expect(flag1).toBe(2);
});

it('passes the data through', () => {
  const emitter = new Emitter();
  emitter.on('test', data => {
    expect(data).toBe('data');
  });
  emitter.emit('test', 'data');
});

// Type Testing
it('example with types', () => {
  interface EventMap {
    test: string;
    cool: number;
    noData: undefined;
  }

  const emitter = new Emitter<EventMap>();

  emitter.on('test', data => {
    const cast: string = data;
  });
  emitter.on('cool', data => {
    const cast: number = data;
  });
  emitter.on('noData', data => {
    // data should be never here
  });

  // Valid
  emitter.emit('test', 'data');
  emitter.emit('cool', 1);
  emitter.emit('noData');

  // Invalid
  // @ts-expect-error
  emitter.emit('test');
  // @ts-expect-error
  emitter.emit('dsads');
  // @ts-expect-error
  emitter.emit('noData', 'data');
});
