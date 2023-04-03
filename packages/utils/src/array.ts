/** Returns a (copied) array with just the unique items in it. */
export function unique<T>(arr: Iterable<T>) {
  return Array.from(new Set(arr));
}

/** Returns a (copied) array with just the unique items in it. */
export function uniqueBy<T>(arr: Iterable<T>, identify: (x: T) => any) {
  const set = new Set();
  const out = [];
  for (const item of arr) {
    const id = identify(item);
    if (!set.has(id)) {
      set.add(id);
      out.push(id);
    }
  }
  return out;
}

/** In place shuffle function for an array. */
export function shuffle<T>(t: T[]): T[] {
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

/** Creates an array using a length and a `map(index)` function. */
export function createArray<T>(length: number, map: (index: number) => T): T[] {
  const arr = Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = map(i);
  }
  return arr;
}

/** Moves index `i` to index `j` in an array immutably. */
export function moveArrayValue<T>(arr: T[], i: number, j: number): T[] {
  return [...arr.slice(0, i), ...arr.slice(i + 1, j), arr[i], ...arr.slice(j + 1)];
}

/** Remove an item from an array immutably. */
export function removeArrayValue<T>(arr: T[], i: number): T[] {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

/** Insert an item into an array immutably. */
export function insertArrayValue<T>(arr: T[], i: number, value: T): T[] {
  return [...arr.slice(0, i), value, ...arr.slice(i)];
}

/**
 * Returns an iterator with a specified range. Range includes the first number and does not include
 * the second.
 */
export function range(length: number): IterableIterator<number>;
export function range(start: number, end: number, step?: number): IterableIterator<number>;
export function* range(a: number, b?: number, c = 1): IterableIterator<number> {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  for (let i = a; i < b; i += c) {
    yield i;
  }
}
