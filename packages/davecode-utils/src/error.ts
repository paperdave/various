/**
 * Runs the function, and if it throws an error, return the fallback value. If the callback is
 * async, a promise will always be returned.
 */
export function tryOrFallback<Value, Fallback>(
  cb: () => Value,
  fallback: Fallback
): Value extends Promise<infer R> ? Promise<R | Fallback> : Value | Fallback {
  // Typescript is a little silly and cannot infer these return types properly :/
  try {
    const result = cb();
    if (result instanceof Promise) {
      return result.catch(() => fallback) as any;
    }
    return result as any;
  } catch (e) {
    return fallback as any;
  }
}
