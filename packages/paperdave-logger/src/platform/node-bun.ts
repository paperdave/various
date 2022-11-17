import { writeSync } from 'fs';

/** File Descriptor for standard output. */
export const STDOUT = 1;

/** File Descriptor for standard error. */
export const STDERR = 2;

/** File Descriptor for standard input. */
export const STDIN = 0;

export const platformWidgetEnabled = true;

export const platformWrite = {
  info(content: string) {
    writeSync(STDOUT, content + '\n');
  },
  error(content: string) {
    writeSync(STDERR, content + '\n');
  },
  warn(content: string) {
    writeSync(STDOUT, content + '\n');
  },
  debug(content: string) {
    writeSync(STDOUT, content + '\n');
  },
  widget(content: string) {
    writeSync(STDERR, content);
  },
};

// Inlined from
// https://github.com/sindresorhus/is-unicode-supported/blob/main/index.js
export const platformUnicodeSupported =
  process.platform === 'win32'
    ? Boolean(process.env.CI) ||
      Boolean(process.env.WT_SESSION) || // Windows Terminal
      process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
      process.env.TERM_PROGRAM === 'vscode' ||
      process.env.TERM === 'xterm-256color' ||
      process.env.TERM === 'alacritty' ||
      process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
    : process.env.TERM !== 'linux';
