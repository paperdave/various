/** Returns a (copied) array with just the unique items in it. */
export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
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
  return Array(length)
    .fill(null)
    .map((_, index) => map(index));
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
