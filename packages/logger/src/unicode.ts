import { platformUnicodeSupported } from '$platform';

/**
 * Boolean if the current environment supports unicode. Functions identically to the
 * `is-unicode-supported` package.
 */
export const isUnicodeSupported = platformUnicodeSupported;

// Inlined without chalk from
// https://github.com/sindresorhus/log-symbols/blob/main/index.js

/**
 * Contains unicode symbols for various log symbols, falling to non-unicode characters if needed.
 * Does not have colors, unlike the `log-symbols` package this is based off of.
 */
export const logSymbols = isUnicodeSupported
  ? {
      error: '✖',
      success: '✔',
      info: 'ℹ',
      warning: '⚠',
    }
  : {
      error: 'x',
      success: '√',
      info: 'i',
      warning: '‼',
    };
