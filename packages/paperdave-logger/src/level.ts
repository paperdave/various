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

/** The log level. */
export let level =
  typeof process !== 'undefined' && !!process.env.DEBUG ? LogLevel.Debug : LogLevel.Info;

/** Sets the log level. Accepts a `LogLevel` enum or a string. */
export function setLevel(show: SetLevelInput) {
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
}
