import { writeSync } from 'node:fs';
import { formatStackTrace } from './error';
import { level, LogLevel } from './level';
import { createLogger } from './log-base';
import { logSymbols } from './unicode';
import { STDERR, STDOUT } from './util';
import { clearWidgets, redrawWidgets } from './widget';

// We use prefixed constants with functions to preserve autocomplete:

const _info = createLogger('info', {
  id: '*',
  color: 'blueBright',
});

/** Writes a log line with a blue `info` prefix. */
export function info(...data: any[]) {
  _info(...data);
}

const _warn = createLogger('warn', {
  id: '*',
  color: 'yellowBright',
  coloredText: true,
});

/** Writes a log line with a yellow `warn` prefix. */
export function warn(...data: any[]) {
  _warn(...data);
}

const _trace = createLogger('trace', {
  id: '*',
  color: 208,
  error: true,
});

/** Writes a log line with a yellow `warn` prefix. */
export function trace(...data: any[]) {
  if (_trace.visible) {
    _trace(...(data.length === 0 ? [' '] : data));
    writeSync(STDERR, formatStackTrace(new Error()).split('\n').slice(1).join('\n') + '\n');
  }
}

const _error = createLogger(logSymbols.error, {
  id: '*',
  color: 'redBright',
  coloredText: true,
  error: true,
});

/**
 * Writes a log line with a red `error` prefix. Accepts an `Error` or `PrintableError` in addition
 * to standard text, in which case it will print the error in a pretty way.
 */
export function error(...data: any[]) {
  _error(...data);
}

const _debug = createLogger('debug', {
  id: 'debug',
  color: 'cyanBright',
});

/** Writes a log line with a cyan `debug` prefix. These are not visible by default. */
export function debug(...data: any[]) {
  _debug(...data);
}

const _success = createLogger(logSymbols.success, {
  id: '*',
  color: 'greenBright',
  coloredText: true,
});

/** Writes a log line in all green and with a checkmark prefix. */
export function success(...data: any[]) {
  _success(...data);
}

// TODO: move this
/** Writes raw line of text, but will do nothing if the log level is set to `LogLevel.Silent` */
export function writeLine(data: string) {
  if (level > LogLevel.Silent) {
    clearWidgets();
    writeSync(STDOUT, data + '\n');
    redrawWidgets();
  }
}
