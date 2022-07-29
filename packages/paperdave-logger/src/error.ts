import path from 'node:path';
import wrapAnsi from 'wrap-ansi';
import { builtinModules } from 'node:module';
import { ansi } from './ansi';
import { PREFIX_LENGTH, wrapOptions } from './util';

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

export function isBuiltin(pathname: string): boolean {
  return pathname.startsWith('node:') || builtinModules.includes(pathname);
}

/** Utility function we use internally for formatting the stack trace of an error. */
export function formatStackTrace(err: Error) {
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

  return (
    parsed
      .map(({ method, file, line, column, native }) => {
        const source = native
          ? `[native code]`
          : file
          ? isBuiltin(file)
            ? `(${ansi.magenta}${file}${ansi.reset}${ansi.blackBright})`
            : [
                '(',
                ansi.cyan,
                // Leave the first slash on linux.
                process.platform === 'win32'
                  ? path.dirname(file).replace(/^file:\/\/\//g, '')
                  : path.dirname(file).replace(/^file:\/\//g, ''),
                path.sep,
                ansi.green,
                path.basename(file),
                ansi.reset,
                ':',
                line + ':' + column,
                ansi.blackBright,
                ')',
              ].join('')
          : '<unknown>';

        return `\u200b  ${ansi.blackBright}at ${method === '' ? '' : `${method} `}${source}`;
      })
      .join('\n') + ansi.reset
  );
}

/** Formats the given error as a full log string. */
export function formatErrorObj(err: Error | PrintableError, boldFirstLine = false) {
  const { name, message, description, hideStack, hideName, stack } = err as PrintableError;

  return [
    boldFirstLine ? ansi.red + ansi.bold : ansi.red,
    hideName ? '' : (name ?? 'Error') + ': ',
    message ?? 'Unknown error',
    ansi.reset,
    description ? '\n' + wrapAnsi(description, 90 - PREFIX_LENGTH, wrapOptions) : '',
    hideStack || !stack ? '' : '\n' + formatStackTrace(err),
    description || (!hideStack && stack) ? '\n' : '',
  ].join('');
}

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
