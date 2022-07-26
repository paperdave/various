import path from 'node:path';
import wrapAnsi from 'wrap-ansi';
import { writeSync } from 'node:fs';
import { inspect } from 'node:util';
import { ansi, colorize } from './ansi';

/**
 * In this package we use `writeSync(STDOUT, ...)` to write to the stdout instead of
 * `console.log(...)`, or `process.stdout.write(...)` since it is faster and the code will work
 * across node and bun.
 */
const STDOUT = 0;

/** Enum of log level names to their level ID. */
export enum LogLevel {
  /** Print nothing. */
  Silent = 0,
  /** Print only errors. */
  Error = 1,
  /** Print warnings and errors. */
  Warn = 2,
  /** Print all non-debug, the default. */
  Info = 3,
  /** Print everything. Default is `process.env.DEBUG` is set to true. */
  Debug = 4,
}

/** Either a LogLevel or a string key of the LogLevel. */
type SetLevelInput = LogLevel | Lowercase<keyof typeof LogLevel>;

let level = typeof process !== 'undefined' && !!process.env.DEBUG ? LogLevel.Debug : LogLevel.Info;

/** Hardcoded magic number, all prefixes are 6 characters excluding colors, eg `info `. */
const PREFIX_LENGTH = 6;

const wrapOptions = {
  trim: false,
  hard: true,
};

function stringify(...data: any[]) {
  return data.map(obj => (typeof obj === 'string' ? obj : inspect(obj, false, 4, true))).join(' ');
}

function logPrefixed(prefix: string, content: string) {
  if (content === '') {
    writeSync(STDOUT, '\n');
    return;
  }

  const wrapped = wrapAnsi(content, 90 - 6, wrapOptions) //
    .replace(/\n\s*/g, '\n' + ' '.repeat(PREFIX_LENGTH));

  writeSync(STDOUT, prefix + wrapped + '\n');
}

/**
 * A Printable Error is an error that defines some extra fields. `@paperdave/logger` handles these
 * objects within logs which allows customizing their appearance. It can be useful when building
 * CLIs to throw formatted error objects that instruct the user what they did wrong, without
 * printing a huge piece of text with a useless stack trace.
 *
 * @see {CLIError} an easy class to construct these objects.
 */
export interface PrintableError extends Error {
  description: string;
  hideStack?: boolean;
  hideName?: boolean;
}

export interface Logger {
  /** Writes a log line with a blue `info` prefix. */
  info(...data: any[]): void;
  /** Writes a log line with a yellow `warn` prefix. */
  warn(...data: any[]): void;
  /**
   * Writes a log line with a yellow `error` prefix. Accepts an `Error` or `PrintableError` in
   * addition to standard text, in which case it will print the error in a pretty way.
   */
  error(error: Error | PrintableError): void;
  /**
   * Writes a log line with a yellow `error` prefix. Accepts an `Error` or `PrintableError` in
   * addition to standard text, in which case it will print the error in a pretty way.
   */
  error(...data: any[]): void;
  /** Writes a log line with a cyan `debug` prefix. These are not visible by default. */
  debug(...data: any[]): void;
  /** Writes a log line in all green and with a checkmark prefix. */
  success(...data: any[]): void;

  /** Writes raw text, but will do nothing if the log level is set to `LogLevel.Silent` */
  writeRaw(data: string): void;
  /** Writes raw line of text, but will do nothing if the log level is set to `LogLevel.Silent` */
  writeRawLine(data: string): void;

  /** Sets the log level. Accepts a `LogLevel` enum or a string. */
  setLevel(level: SetLevelInput): void;
}

/** Utility function we use internally for formatting the stack trace of an error. */
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

/** An opiniated logger object. */
export const log: Logger = {
  info: (...data: any[]) => {
    if (level >= LogLevel.Info) {
      logPrefixed(`${ansi.blueBright}${ansi.bold}info  ${ansi.reset}`, stringify(...data));
    }
  },
  warn: (...data: any[]) => {
    if (level >= LogLevel.Warn) {
      logPrefixed(
        `${ansi.yellowBright}${ansi.bold}warn  ${ansi.reset}`,
        colorize(ansi.yellowBright, stringify(...data))
      );
    }
  },
  error(...data: any[]) {
    if (level >= LogLevel.Error) {
      logPrefixed(
        `${ansi.redBright}${ansi.bold}error ${ansi.reset}`,
        data.length === 1 && data[0] instanceof Error
          ? formatErrorObj(data[0])
          : colorize(ansi.redBright, stringify(...data))
      );
    }
  },
  debug(...data: any[]) {
    if (level >= LogLevel.Debug) {
      logPrefixed(`${ansi.cyanBright}${ansi.bold}debug ${ansi.reset}`, stringify(...data));
    }
  },
  success(...data: any[]) {
    if (level >= LogLevel.Info) {
      const str = stringify(...data);
      if (str === '') {
        writeSync(0, '\n');
      } else {
        writeSync(
          0,
          wrapAnsi(colorize(ansi.green + ansi.bold, '✔ ' + str), 90, wrapOptions) + '\n'
        );
      }
    }
  },
  writeRaw(data: string) {
    if (level > LogLevel.Silent) {
      writeSync(STDOUT, data);
    }
  },
  writeRawLine(data: string) {
    if (level > LogLevel.Silent) {
      writeSync(STDOUT, data + '\n');
    }
  },
  setLevel(show: SetLevelInput) {
    if (typeof show === 'number') {
      level = show;
    } else {
      switch (show) {
        case 'debug':
          level = LogLevel.Debug;
          break;
        case 'info':
          level = LogLevel.Info;
          break;
        case 'warn':
          level = LogLevel.Warn;
          break;
        case 'error':
          level = LogLevel.Error;
          break;
        case 'silent':
          level = LogLevel.Silent;
          break;
      }
    }
  },
};

/**
 * When this error is passed to `log.error`, it will be printed with a custom long-description. This
 * is useful to give users a better description on what the error actually is. Does not show a stack
 * trace by default.
 *
 * For example, in Purplet we throw this error if the `$DISCORD_BOT_TOKEN` environment variable is missing.
 *
 * ```ts
 * new CLIError(
 *   'Missing DISCORD_BOT_TOKEN environment variable!',
 *   dedent`
 *     Please create an ${chalk.cyan('.env')} file with the following contents:
 *
 *     ${chalk.cyanBright('DISCORD_BOT_TOKEN')}=${chalk.grey('<your bot token>')}
 *
 *     You can create or reset your bot token at ${devPortalLink}
 *   `
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

/**
 * Injects the logger into `globalThis.console`, or whatever is given. Only fills the following
 * functions: `log`, `info`, `warn`, `error`, `debug`.
 *
 * For accessing some special functions, use the `log` object directly.
 */
export function injectLogger(obj = console) {
  obj.log = log.info;
  obj.info = log.info;
  obj.warn = log.warn;
  obj.error = log.error;
  obj.debug = log.debug;
}
