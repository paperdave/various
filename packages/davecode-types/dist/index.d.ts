export type { SymmetricDifference, NonUndefined, FunctionKeys, NonFunctionKeys, MutableKeys, ReadonlyKeys, RequiredKeys, OptionalKeys, PickByValue, PickByValueExact, OmitByValue, OmitByValueExact, Intersection, Diff, Subtract, Overwrite, Assign, Unionize, DeepReadonly, DeepRequired, DeepNonNullable, DeepPartial, Brand, Optional, ValuesType, UnionToIntersection, Mutable, } from "utility-types";
/** Shorthand notation for a dictionary object, aka Record<string, T> */
export declare type Dict<T> = Record<string, T>;
/** Represents something that *might* be a promise. */
export declare type Awaitable<T> = T | Promise<T>;
/**
 * Resolves a promise, if present.
 * ```ts
 *   // Expect: string;
 *   type Response = Await<Promise<string>>;
 * ```
 */
export declare type Await<T> = T extends Promise<infer U> ? Await<U> : T;
/**
 * Identity will force the hover overlay to flatten this type one layer down.
 */
export declare type Identity<T> = T extends Record<string, unknown> ? {
    [P in keyof T]: Identity<T[P]>;
} : T;
/**
 * ObjectWithMethod<Key, Method> resolves to an object with a single method. In autocomplete, the "method/function" icon is shown instead of the "property" icon.
 */
export declare type ObjectWithMethod<Key extends PropertyKey, Value extends (args: any[]) => any, Obj = {
    method(...args: Parameters<Value>): ReturnType<Value>;
}> = {
    [K in keyof Obj as Key]: Obj[K];
};
