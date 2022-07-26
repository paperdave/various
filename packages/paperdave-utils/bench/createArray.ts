// Different approaches for createArray
import { bench, group, run } from 'mitata';

const mapfn = (x: number) => (x * x + 50).toString(32).toUpperCase();

function defineTest(LENGTH: number) {
  group(`createArray(${LENGTH}, mapfn)`, () => {
    bench('Array.from({ length: n }, ...)', () => {
      return Array.from({ length: LENGTH }, (_, i) => mapfn(i));
    });
    bench('Array(n).fill(undefined).map(...)', () => {
      return Array(LENGTH)
        .fill(undefined)
        .map((_, i) => mapfn(i));
    });
    bench('Array + for loop', () => {
      let arr = Array(LENGTH);
      for (let i = 0; i < LENGTH; i++) {
        arr[i] = mapfn(i);
      }
      return arr;
    });
  });
}

defineTest(10);
defineTest(100);
defineTest(10000);

run();
