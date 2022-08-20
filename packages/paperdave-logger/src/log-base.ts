import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import type { Chalk } from 'chalk';
import { writeSync } from 'fs';
import { inspect } from 'util';
import { formatErrorObj } from './error';
import { isLogVisible } from './filter';
import type { CustomLoggerColor, CustomLoggerOptions, StringLike } from './types';
import { LogFunction } from './types';
import { STDERR, STDOUT } from './util';

/** Taken from https://github.com/debug-js/debug/blob/d1616622e4d404863c5a98443f755b4006e971dc/src/node.js#L35. */
const COLORS = [
  20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77,
  78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164,
  165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201,
  202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
];

/** Converts non string objects into a string the way Node.js' console.log does it. */
function stringify(...data: any[]) {
  return data
    .map(obj => {
      if (typeof obj === 'string') {
        return obj;
      } else if (obj instanceof Error) {
        return formatErrorObj(obj);
      }
      return inspect(obj, false, 4, true);
    })
    .join(' ');
}

/**
 * Selects a color for a debug namespace.
 *
 * Taken from https://github.com/debug-js/debug/blob/master/src/common.js.
 */
function selectColor(namespace: string) {
  let hash = 0;

  for (let i = 0; i < namespace.length; i++) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return COLORS[Math.abs(hash) % COLORS.length];
}

function getColor(color: CustomLoggerColor): Chalk {
  if (typeof color === 'string') {
    return color in chalk ? (chalk.bold as any)[color] : chalk.bold.hex(color);
  } else if (Array.isArray(color)) {
    return chalk.bold.rgb(color[0], color[1], color[2]);
  }
  return chalk.bold.ansi256(color);
}

const formatImplementation = {
  '%s': (data: StringLike) => String(data),
  '%d': (data: number) => String(data),
  '%i': (data: number) => String(Math.floor(data)),
  '%f': (data: number) => String(data),
  '%x': (data: number) => data.toString(16),
  '%X': (data: number) => data.toString(16).toUpperCase(),
  '%o': (data: any) => JSON.stringify(data),
  '%O': (data: any) => JSON.stringify(data, null, 2),
  '%c': () => '',
  '%j': (data: any) => JSON.stringify(data),
};

function format(fmt: any, ...args: any[]) {
  if (typeof fmt === 'string') {
    let index = 0;
    const result = fmt.replace(/%[%sdifoxXcj]/g, match => {
      if (match === '%%') {
        return '%';
      }
      const arg = args[index++];
      return (formatImplementation as any)[match](arg);
    });

    if (index === 0 && args.length > 0) {
      return result + stringify(...args);
    }

    return result;
  }
  return stringify(fmt, ...args);
}

const LogFunction = {
  __proto__: Function.prototype,
  get visible() {
    return isLogVisible((this as any).name);
  },
  [Symbol.for('nodejs.util.inspect.custom')](depth: number, options: any) {
    return options.stylize(`[LogFunction: ${(this as any).name}]`, 'special');
  },
};

export function createLogger(
  name: string,
  opts: CustomLoggerOptions | CustomLoggerColor = {}
): LogFunction {
  if (typeof opts === 'string' || Array.isArray(opts) || typeof opts === 'number') {
    opts = { color: opts };
  }

  const {
    //
    id = name,
    color = undefined,
    coloredText = false,
    boldText = false,
    error = false,
    debug = false,
  } = opts;

  const strippedName = stripAnsi(name);

  const colorFn = name.includes('\x1b')
    ? chalk
    : color
    ? getColor(color)
    : chalk.bold.ansi256(selectColor(name));
  const coloredName = colorFn.bold(name);

  const fn = (fmt: unknown, ...args: any[]) => {
    if (!isLogVisible(id, !debug)) {
      return;
    }

    const data = format(fmt, ...args).replace(/\n/g, '\n ' + ' '.repeat(strippedName.length));
    writeSync(
      error ? STDERR : STDOUT,
      coloredName +
        ' ' +
        (coloredText ? (boldText ? colorFn.bold(data) : colorFn(data)) : data) +
        '\n'
    );
  };
  fn.__proto__ = LogFunction;

  Object.defineProperty(fn, 'name', { value: id });

  return fn as unknown as LogFunction;
}
