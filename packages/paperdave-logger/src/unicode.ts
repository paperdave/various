// Inlined from
// https://github.com/sindresorhus/is-unicode-supported/blob/main/index.js

/**
 * Boolean if the current environment supports unicode. Functions identically to the
 * `is-unicode-supported` package.
 */
export const isUnicodeSupported =
  process.platform === 'win32'
    ? Boolean(process.env.CI) ||
      Boolean(process.env.WT_SESSION) || // Windows Terminal
      process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
      process.env.TERM_PROGRAM === 'vscode' ||
      process.env.TERM === 'xterm-256color' ||
      process.env.TERM === 'alacritty' ||
      process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
    : process.env.TERM !== 'linux';

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
