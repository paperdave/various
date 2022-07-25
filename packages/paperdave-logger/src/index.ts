import path from 'node:path';
import wrapAnsi from 'wrap-ansi';
import { inspect } from 'node:util';
import { ansi, colorize } from './ansi';

let showDebug = typeof process !== 'undefined' && !!process.env.DEBUG;

const PREFIX_LENGTH = 6;

const wrapOptions = {
  trim: false,
  hard: true,
};

const write =
  typeof Bun !== 'undefined'
    ? (data: string) => Bun.write(Bun.stdout, data)
    : (data: string) => (process as any).stdout.write(data);

function writeLine(data: string) {
  write(data + '\n');
}

function stringify(...data: any[]) {
  return data.map(obj => (typeof obj === 'string' ? obj : inspect(obj, false, 4, true))).join(' ');
}

function logPrefixed(prefix: string, content: string) {
  if (content === '') {
    write('\n');
    return;
  }

  const wrapped = wrapAnsi(content, 90 - 6, wrapOptions) //
    .replace(/\n\s*/g, '\n' + ' '.repeat(PREFIX_LENGTH));

  write(prefix + wrapped + '\n');
}

export interface PrintableError extends Error {
  description: string;
  hideStack?: boolean;
  hideName?: boolean;
}

interface Logger {
  info(...data: any[]): void;
  warn(...data: any[]): void;
  error(error: Error | PrintableError): void;
  error(...data: any[]): void;
  debug(...data: any[]): void;
  success(...data: any[]): void;

  writeRaw(data: string): void;
  writeRawLine(data: string): void;

  setShowDebug(showDebug: boolean): void;
}

function formatStackTrace(err: Error) {
  if (!err.stack) {
    return '';
  }
  const v8firstLine = `${err.name}${err.message ? ': ' + err.message : ''}\n`;
  const parsed = err.stack.startsWith(v8firstLine)
    ? err.stack
        .slice(v8firstLine.length)
        .split('\n')
        .map(line => {
          const match = /at (.*) \((.*):(\d+):(\d+)\)/.exec(line);
          if (!match) {
            return { method: '<unknown>', file: null, line: null, column: null };
          }
          return {
            method: match[1],
            file: match[2],
            line: parseInt(match[3], 10),
            column: parseInt(match[4], 10),
            native: line.includes('[native code]'),
          };
        })
    : err.stack.split('\n').map(line => {
        const at = line.indexOf('@');
        const method = line.slice(0, at);
        const file = line.slice(at + 1);
        const fileSplit = /^(.*?):(\d+):(\d+)$/.exec(file);
        return {
          method: (['module code'].includes(method) ? '' : method) || '',
          file: fileSplit ? fileSplit[1] : null,
          line: fileSplit ? parseInt(fileSplit[2], 10) : null,
          column: fileSplit ? parseInt(fileSplit[3], 10) : null,
          native: file === '[native code]',
        };
      });

  const firstNative = parsed.reverse().findIndex(line => !line.native);
  if (firstNative !== -1) {
    // remove the first native lines
    parsed.splice(0, firstNative, {
      native: true,
      method: '',
      column: null,
      line: null,
      file: null,
    });
  }
  parsed.reverse();

  return parsed
    .map(({ method, file, line, column, native }) => {
      const source = native
        ? `[native code]`
        : file
        ? [
            ansi.cyan,
            path.dirname(file),
            path.sep,
            ansi.greenBright,
            path.basename(file),
            ansi.reset,
            ansi.blackBright,
            ':',
            ansi.reset,
            ansi.yellowBright,
            line,
            ansi.reset,
            ansi.blackBright,
            ':',
            ansi.redBright,
            column,
          ].join('')
        : '<unknown>';

      return `\u200b  ${ansi.blackBright}at ${method === '' ? '' : `${method} `}${source}`;
    })
    .join('\n');
}

function formatErrorObj(err: Error | PrintableError) {
  const { name, message, description, hideStack, hideName, stack } = err as PrintableError;

  return [
    ansi.redBright,
    hideName ? '' : (name ?? 'Error') + ': ',
    message ?? 'Unknown error',
    ansi.reset,
    description ? '\n' + wrapAnsi(description, 90 - 6, wrapOptions) : '',
    hideStack || !stack ? '' : '\n' + formatStackTrace(err),
    description || (!hideStack && stack) ? '\n' : '',
  ].join('');
}

export const log: Logger = {
  info: (...data: any[]) =>
    logPrefixed(`${ansi.blueBright}${ansi.bold}info  ${ansi.reset}`, stringify(...data)),
  warn: (...data: any[]) =>
    logPrefixed(
      `${ansi.yellowBright}${ansi.bold}warn  ${ansi.reset}`,
      colorize(ansi.yellowBright, stringify(...data))
    ),
  error(...data: any[]) {
    logPrefixed(
      `${ansi.redBright}${ansi.bold}error ${ansi.reset}`,
      data.length === 1 && data[0] instanceof Error
        ? formatErrorObj(data[0])
        : colorize(ansi.redBright, stringify(...data))
    );
  },
  debug(...data: any[]) {
    if (showDebug) {
      logPrefixed(`${ansi.cyanBright}${ansi.bold}debug ${ansi.reset}`, stringify(...data));
    }
  },
  success(...data: any[]) {
    const str = stringify(...data);
    if (str === '') {
      write('\n');
    } else {
      write(wrapAnsi(colorize(ansi.green + ansi.bold, '✔ ' + str), 90, wrapOptions) + '\n');
    }
  },
  writeRaw: write,
  writeRawLine: writeLine,
  setShowDebug(show: boolean) {
    showDebug = show;
  },
};

/**
 * When this error is passed to `log.error`, it will be printed with a custom long-description. This
 * is useful to give users a better description on what the error actually is. Does not show a stack
 * trace by default.
 *
 * ```ts
 * new CLIError(
 *   'Invalid config file',
 *   `Please check your config file at ${chalk.cyan(config)} and try again.`
 * );
 * ```
 */
export class CLIError extends Error implements PrintableError {
  constructor(public message: string, public description: string) {
    super(message);
    this.name = 'CLIError';
  }

  get hideStack() {
    return true;
  }

  get hideName() {
    return true;
  }
}

export function injectLogger(obj = console) {
  // obj.
}
