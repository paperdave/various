/* eslint-disable @typescript-eslint/no-unused-vars */
export function range(from = 0, to = 1) {
  return Array.from({ length: to - from }, (_, i) => from + i);
}

function getTypeParams(n: number) {
  return range(0, n)
    .map(i => `T${i}`)
    .join(', ');
}

function getFuncs(name: string, n: number) {
  return range(0, n - 1)
    .map(i => `f${i + 1}: ${name}<T${i}, T${i + 1}>`)
    .join(', ');
}

const f = range(2, 16).map(
  n => `function pipe<${getTypeParams(n)}>(input: T0, ${getFuncs('F', n)}): T${n - 1}`
);

const a = range(2, 16).map(
  n => `function pipeAsync<${getTypeParams(n)}>(input: T0, ${getFuncs('A', n)}): Promise<T${n - 1}>`
);

// log f or a to generate content used in pipe.longlines.ts
