// Don't reinvent the wheel. Someone already made some nice types, however I do not want to
import { DeepReadonly } from 'utility-types';

// re-export their entire library.
export type {
  Assign,
  Brand,
  DeepNonNullable,
  DeepPartial,
  DeepReadonly,
  DeepRequired,
  Diff,
  FunctionKeys,
  Intersection,
  Mutable,
  MutableKeys,
  NonFunctionKeys,
  NonUndefined,
  OmitByValue,
  OmitByValueExact,
  Optional,
  OptionalKeys,
  Overwrite,
  PickByValue,
  PickByValueExact,
  ReadonlyKeys,
  RequiredKeys,
  Subtract,
  SymmetricDifference,
  Unionize,
  UnionToIntersection,
  ValuesType,
} from 'utility-types';

// TODO: pick out some nice stuff from `ts-toolbelt`. There's a lot, and I think keeping some
// of their prefixing is a good idea, but at that point I should just straight up use `ts-toolbelt`.

/** Shorthand notation for a dictionary object, aka Record<string, T> */
export type Dict<T> = Record<string, T>;

/** Represents something that _might_ be a promise. */
export type Awaitable<T> = T | Promise<T>;

/**
 * Resolves a promise, if present.
 *
 * ```ts
 * // Expect: string;
 * type Response = Await<Promise<string>>;
 * ```
 */
export declare type Await<T> = T extends Promise<infer U> ? Await<U> : T;

/** Identity will force the hover overlay to flatten this type one layer down. */
export type Identity<T> = T extends Record<string, unknown>
  ? { [P in keyof T]: Identity<T[P]> }
  : T;

/**
 * ObjectWithMethod<Key, Method> resolves to an object with a single method. In autocomplete, the
 * "method/function" icon is shown instead of the "property" icon.
 */
export type ObjectWithMethod<
  Key extends PropertyKey,
  Value extends (args: any[]) => any,
  Obj = {
    method(...args: Parameters<Value>): ReturnType<Value>;
  }
> = { [K in keyof Obj as Key]: Obj[K] };

/** `Immutable<T>` represents T as an immutable object. Equal to DeepReadonly<T>, with a different name. */
export type Immutable<T> = DeepReadonly<T>;
