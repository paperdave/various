import chalk from 'chalk';
import { debug, error, info, trace, warn, writeLine } from './log';
import { Spinner } from './spinner';

export interface InjectOptions {
  console?: typeof console;
  process?: typeof process;
  uncaughtExceptions?: boolean;
  unhandledRejections?: boolean;
  exitOnError?: boolean;
}

/**
 * Injects the logger into `globalThis.console`, or whatever is given. Only fills the following
 * functions: `log`, `info`, `warn`, `error`, `debug`.
 *
 * For accessing some special functions, use the `log` object directly.
 */
export function injectLogger(opts?: InjectOptions): void;
/**
 * ```ts
 * injectLogger({
 *   console: customConsoleObject,
 * });
 * ```
 *
 * @deprecated Please pass an options object to `injectLogger`, seen above.
 */
export function injectLogger(opts: typeof console): void;
export function injectLogger(opts: InjectOptions | typeof console = {}) {
  if (typeof (opts as typeof console).log === 'function') {
    opts = {
      console: opts as typeof console,
    };
  }

  const {
    console: injectConsole = globalThis.console,
    process: injectProcess = globalThis.process,
    uncaughtExceptions = true,
    unhandledRejections = true,
    exitOnError = true,
  } = opts as InjectOptions;

  // Basic Logging Functions
  injectConsole.log = info;
  injectConsole.info = info;
  injectConsole.warn = warn;
  injectConsole.error = error;
  injectConsole.debug = debug;

  // Assert
  injectConsole.assert = (condition, ...msg: Parameters<typeof error>) => {
    if (!condition) {
      error(...msg);
    }
  };

  // Time
  const timers = new Map<string, { start: number; spinner: Spinner }>();
  injectConsole.time = (label: string) => {
    if (timers.has(label)) {
      injectConsole.warn(`Timer '${label}' already exists.`);
      return;
    }
    timers.set(label, {
      start: performance.now(),
      spinner: new Spinner({
        text: label,
      }),
    });
  };
  injectConsole.timeEnd = (label: string) => {
    if (!timers.has(label)) {
      injectConsole.warn(`Timer '${label}' does not exist.`);
      return;
    }
    const { start, spinner } = timers.get(label)!;
    timers.delete(label);
    spinner.success(label + chalk.blackBright(` [${(performance.now() - start).toFixed(3)}ms]`));
  };
  injectConsole.timeLog = (label: string) => {
    if (!timers.has(label)) {
      injectConsole.warn(`Timer '${label}' does not exist.`);
      return;
    }
    const { start } = timers.get(label)!;
    injectConsole.log(label + chalk.blackBright(` [${(performance.now() - start).toFixed(3)}ms]`));
  };

  const counters = new Map<string, number>();
  injectConsole.count = (label: string) => {
    const n = (counters.get(label) || 0) + 1;
    counters.set(label, n);
    injectConsole.log(`${label}: ${n}`);
  };
  injectConsole.countReset = (label: string) => {
    counters.set(label, 0);
  };

  injectConsole.trace = trace;

  // TODO: Implement `group`, `groupEnd`, `groupCollapsed`, `table`

  if (uncaughtExceptions) {
    (injectProcess as any).on?.('uncaughtException', (exception: any) => {
      error(exception);

      if (exitOnError) {
        writeLine('The above error was not caught by a catch block, execution cannot continue.');

        process.exit(1);
      }
    });
  }
  if (unhandledRejections) {
    (injectProcess as any).on?.('unhandledRejection', (reason: any) => {
      error(reason);

      if (exitOnError) {
        writeLine(
          '\nThe above error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch()'
        );
        process.exit(1);
      }
    });
  }
}
