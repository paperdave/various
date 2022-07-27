import { inspect } from 'util';

/**
 * In this package we use `writeSync(STDOUT, ...)` to write to the stdout instead of
 * `console.log(...)`, or `process.stdout.write(...)` since it is faster and the code will work
 * across node and bun.
 */
export const STDOUT = 0;

/** Hardcoded magic number, all prefixes are 6 characters excluding colors, eg `info `. */
export const PREFIX_LENGTH = 6;

/** For `ansi-wrap` */
export const wrapOptions = {
  trim: false,
  hard: true,
};

/** Converts non string objects into a string the way Node.js' console.log does it. */
export function stringify(...data: any[]) {
  return data.map(obj => (typeof obj === 'string' ? obj : inspect(obj, false, 4, true))).join(' ');
}

export type Timer = ReturnType<typeof setInterval>;

export enum Color {
  Black = 'black',
  Red = 'red',
  Green = 'green',
  Yellow = 'yellow',
  Blue = 'blue',
  Magenta = 'magenta',
  Cyan = 'cyan',
  White = 'white',
  BlackBright = 'blackBright',
  RedBright = 'redBright',
  GreenBright = 'greenBright',
  YellowBright = 'yellowBright',
  BlueBright = 'blueBright',
  MagentaBright = 'magentaBright',
  CyanBright = 'cyanBright',
  WhiteBright = 'whiteBright',
}
