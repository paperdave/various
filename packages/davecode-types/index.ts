// Don't reinvent the wheel. Someone already made some nice types, however I do not want to

// re-export their entire library.
export type {
  Assign,
  Brand,
  Class,
  DeepNonNullable,
  DeepPartial,
  DeepRequired,
  Diff,
  FunctionKeys,
  Intersection,
  Mutable as MutableObject,
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
  Primitive,
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

/**
 * Utility type to force the hover tooltip to "simplify" it's type, one layer down. Call repeatedly
 * to simplify multiple passes.
 */
export type ForceSimplify<T> = T extends Record<string, unknown>
  ? { [P in keyof T]: ForceSimplify<T[P]> }
  : T;

/**
 * Utility type to prevent the hover tooltip from automatically simplifying. Place at the root of
 * another type to get it's hover overlay to show `YourTypeName<{ passed type }>`
 *
 * WIP.
 */
export type PreventAutoSimplify<T> = T;

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

/** Separate type so if you Simplify<Immutable<T>>, it will handle properly. */
type _Immutable<T> = T extends Array<infer U>
  ? ReadonlyArray<_Immutable<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<_Immutable<U>>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<_Immutable<K>, _Immutable<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<_Immutable<K>, _Immutable<V>>
  : T extends Set<infer U>
  ? ReadonlySet<_Immutable<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<_Immutable<U>>
  : T extends Record<PropertyKey, unknown>
  ? { readonly [P in keyof T]: _Immutable<T[P]> }
  : T;

/** `Immutable<T>` represents T as an immutable object (recursive) */
export type Immutable<T> = PreventAutoSimplify<_Immutable<T>>;

/** `Mutable<T>` represents T as a mutable object (recursive). Reverse of Immutable<T>. */
export type Mutable<T> = T extends ReadonlyArray<infer U>
  ? Array<Mutable<U>>
  : T extends Array<infer U>
  ? Array<Mutable<U>>
  : T extends Record<PropertyKey, unknown>
  ? { -readonly [P in keyof T]: Mutable<T[P]> }
  : T;
