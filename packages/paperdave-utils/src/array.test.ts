import { describe, expect, test } from 'bun:test';
import { shuffle, unique } from './array';

describe('unique', () => {
  test('array is copied and not mutated', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const copy = arr.concat();
    const result = unique(arr);
    expect(result === arr).toBe(false);
    expect(result.length).toBe(10);
    for (let i = 0; i < arr.length; i++) {
      expect(result[i]).toBe(copy[i]);
    }
  });
  test('duplicate entries are removed', () => {
    const arr = [1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 52, 4, 5, 6, 7, 8, 9, 10];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 52];
    const result = unique(arr);
    expect(result.length).toBe(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(expected[i]);
    }
  });
});

describe('shuffle', () => {
  test('array is not copied', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffle(arr);
    expect(result === arr).toBe(true);
  });
  test('every item still exists', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffle(values.concat());
    for (const value of values) {
      expect(result.filter(v => v === value).length).toBe(1);
    }
  });
});
