import chalk from 'chalk';
import path from 'node:path';
import { builtinModules } from 'node:module';

/**
 * A PrintableError is an error that defines some extra fields. `@paperdave/logger` handles these
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
            const match2 = /at (.*):(\d+):(\d+)/.exec(line);
            if (match2) {
              return {
                method: '<top level>',
                file: match2[1],
                line: match2[2],
                column: match2[3],
              };
            }
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

  const nodeModuleJobIndex = parsed.findIndex(
    line => line.file === 'node:internal/modules/esm/module_job'
  );
  if (nodeModuleJobIndex !== -1) {
    parsed.splice(nodeModuleJobIndex, Infinity);
  }

  parsed.reverse();
  const sliceAt = parsed.findIndex(line => !line.native);
  if (sliceAt !== -1) {
    // remove the first native lines
    parsed.splice(0, sliceAt, {
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
        ? isBuiltin(file)
          ? `(${chalk.magenta(file)})`
          : [
              '(',
              chalk.cyan(
                process.platform === 'win32'
                  ? path.dirname(file).replace(/^file:\/\/\//g, '')
                  : path.dirname(file).replace(/^file:\/\//g, '') + path.sep
              ),
              // Leave the first slash on linux.
              chalk.green(path.basename(file)),
              ':',
              line + ':' + column,
              ')',
            ].join('')
        : '<unknown>';

      return chalk.blackBright(`  at ${method === '' ? '' : `${method} `}${source}`);
    })
    .join('\n');
}

/** Formats the given error as a full log string. */
export function formatErrorObj(err: Error | PrintableError) {
  const { name, message, description, hideStack, hideName, stack } = err as PrintableError;

  return [
    hideName ? '' : (name ?? 'Error') + ': ',
    message ?? 'Unknown error',
    description ? '\n' + description : '',
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
