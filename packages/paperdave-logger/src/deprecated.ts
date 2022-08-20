import wrapAnsi from 'wrap-ansi';
import { capitalize } from '@paperdave/utils';
import { writeSync } from 'fs';
import { setLogFilter } from './filter';
import { error } from './log';
import { STDOUT } from './util';
import { clearWidgets, redrawWidgets } from './widget';

/** @deprecated This function will be removed in the future. use the named functions instead. */
export function log(prefix: string, content: string, force = false) {
  clearWidgets();

  if (content === '' && !force) {
    writeSync(STDOUT, '\n');
    return;
  }

  const wrapped = wrapAnsi(content, 90 - 6, { trim: false, hard: true }) //
    .replace(/\n\s*/g, '\n' + ' '.repeat(6));

  writeSync(STDOUT, prefix + wrapped + '\n');

  redrawWidgets();
}

/**
 * Writes a log line in all red and with a cross prefix.
 *
 * @deprecated Use `error` instead.
 */
export function fail(...data: any[]) {
  error(...data);
}

/**
 * Enum of log level names to their level ID.
 *
 * @deprecated Use named logger strings with `setLogFilter` instead.
 */
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

/**
 * The log level.
 *
 * @deprecated
 */
export const level = LogLevel.Info;

/**
 * Sets the log level. Accepts a `LogLevel` enum or a string.
 *
 * @deprecated Use `setLogFilter` instead. Silencing error/info/warn or all logs is not a feature anymore.
 */
export function setLevel(show: SetLevelInput) {
  if (typeof show === 'string') {
    show = LogLevel[capitalize(show) as keyof typeof LogLevel];
  }
  switch (show) {
    case LogLevel.Silent:
      setLogFilter('-*');
      break;
    case LogLevel.Error:
      setLogFilter('-warn', '-info', '-trace', 'error');
      break;
    case LogLevel.Warn:
      setLogFilter('-info');
      break;
    case LogLevel.Info:
      setLogFilter();
      break;
    case LogLevel.Debug:
      setLogFilter('*');
      break;
  }
}
