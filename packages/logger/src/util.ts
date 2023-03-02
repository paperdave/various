import { inspect } from 'util';

/** File Descriptor for standard output. */
export const STDOUT = 1;
/** File Descriptor for standard error. */
export const STDERR = 2;
/** File Descriptor for standard input. */
export const STDIN = 0;

/** Converts non string objects into a string the way Node.js' console.log does it. */
export function stringify(...data: any[]) {
  return data.map(obj => (typeof obj === 'string' ? obj : inspect(obj, false, 4, true))).join(' ');
}

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
