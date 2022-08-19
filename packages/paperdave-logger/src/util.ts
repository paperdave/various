import { writeSync } from 'fs';
import { inspect } from 'util';

/** File Descriptor for standard output. */
export const STDOUT = 2;
/** File Descriptor for standard error. */
export const STDERR = 2;
/** File Descriptor for standard input. */
export const STDIN = 0;

/** Writes output to standard output. This is done using a filesystem call. */
export const write = writeSync.bind(null, STDOUT) as (data: string | Uint8Array) => void;
/** Writes output to standard error. This is done using a filesystem call. */
export const error = writeSync.bind(null, STDERR) as (data: string | Uint8Array) => void;

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

/** A console color enum. */
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
