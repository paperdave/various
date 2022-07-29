import type { Awaitable } from './types';

type F<In, Out> = (input: In) => Out;
type A<In, Out> = (input: Awaited<In>) => Awaitable<Out>;

/** Function equivalent of the pipe operator or Function.pipe() */
function pipe<T0, T1>(input: T0, f1: F<T0, T1>): T1;
function pipe<T0, T1, T2>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>): T2;
function pipe<T0, T1, T2, T3>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>): T3;
function pipe<T0, T1, T2, T3, T4>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>): T4;
function pipe<T0, T1, T2, T3, T4, T5>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>): T5;
function pipe<T0, T1, T2, T3, T4, T5, T6>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>): T6;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>): T7;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>): T8;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>, f9: F<T8, T9>): T9;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>, f9: F<T8, T9>, f10: F<T9, T10>): T10;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>, f9: F<T8, T9>, f10: F<T9, T10>, f11: F<T10, T11>): T11;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>, f9: F<T8, T9>, f10: F<T9, T10>, f11: F<T10, T11>, f12: F<T11, T12>): T12;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>, f9: F<T8, T9>, f10: F<T9, T10>, f11: F<T10, T11>, f12: F<T11, T12>, f13: F<T12, T13>): T13;
function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(input: T0, f1: F<T0, T1>, f2: F<T1, T2>, f3: F<T2, T3>, f4: F<T3, T4>, f5: F<T4, T5>, f6: F<T5, T6>, f7: F<T6, T7>, f8: F<T7, T8>, f9: F<T8, T9>, f10: F<T9, T10>, f11: F<T10, T11>, f12: F<T11, T12>, f13: F<T12, T13>, f14: F<T13, T14>): T14;
function pipe(input: unknown, ...fns: Array<F<unknown, unknown>>): unknown {
  return fns.reduce((current, f) => f(current), input);
}

/** Function equivalent of the pipe operator or Function.pipeAsync() */
function pipeAsync<T0, T1>(input: T0, f1: A<T0, T1>): Promise<T1>;
function pipeAsync<T0, T1, T2>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>): Promise<T2>;
function pipeAsync<T0, T1, T2, T3>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>): Promise<T3>;
function pipeAsync<T0, T1, T2, T3, T4>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>): Promise<T4>;
function pipeAsync<T0, T1, T2, T3, T4, T5>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>): Promise<T5>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>): Promise<T6>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>): Promise<T7>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>): Promise<T8>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>, f9: A<T8, T9>): Promise<T9>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>, f9: A<T8, T9>, f10: A<T9, T10>): Promise<T10>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>, f9: A<T8, T9>, f10: A<T9, T10>, f11: A<T10, T11>): Promise<T11>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>, f9: A<T8, T9>, f10: A<T9, T10>, f11: A<T10, T11>, f12: A<T11, T12>): Promise<T12>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>, f9: A<T8, T9>, f10: A<T9, T10>, f11: A<T10, T11>, f12: A<T11, T12>, f13: A<T12, T13>): Promise<T13>;
function pipeAsync<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(input: T0, f1: A<T0, T1>, f2: A<T1, T2>, f3: A<T2, T3>, f4: A<T3, T4>, f5: A<T4, T5>, f6: A<T5, T6>, f7: A<T6, T7>, f8: A<T7, T8>, f9: A<T8, T9>, f10: A<T9, T10>, f11: A<T10, T11>, f12: A<T11, T12>, f13: A<T12, T13>, f14: A<T13, T14>): Promise<T14>;
async function pipeAsync(input: unknown, ...fns: Array<A<unknown, unknown>>): Promise<unknown> {
  for (const fn of fns) {
    input = await fn(input);
  }
  return input;
}

export { pipe, pipeAsync };
