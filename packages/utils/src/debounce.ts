import type { Timer } from './types';

/** Wrap a function and apply debounce logic to. */
export function debounce<Args extends any[]>(func: (...args: Args) => void, waitTime: number) {
  let timeout: Timer;

  return function (...args: Args) {
    clearTimeout(timeout);
    timeout = setTimeout(func as any, waitTime, ...args);
  };
}

/** Wrap a function and apply throttle logic to. */
export function throttle<Args extends any[]>(func: (...args: Args) => void, waitTime: number) {
  let timeout: Timer | null = null;
  let previous = 0;

  const later = (...args: Args) => {
    previous = Date.now();
    timeout = null;
    func(...args);
  };

  return function (...args: Args) {
    const now = Date.now();
    const remaining = waitTime - (now - previous);
    if (remaining <= 0 || remaining > waitTime) {
      if (timeout) {
        clearTimeout(timeout);
      }
      later(...args);
    } else if (!timeout) {
      //null timeout -> no pending execution
      timeout = setTimeout(later as any, remaining, ...args);
    }
  };
}
