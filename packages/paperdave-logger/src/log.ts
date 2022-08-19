import { writeSync } from 'node:fs';
import { formatStackTrace } from './error';
import { createLogger } from './log-base';
import { logSymbols } from './unicode';
import { STDERR, STDOUT } from './util';
import { clearWidgets, redrawWidgets } from './widget';

/** Writes a log line with a blue `info` prefix. */
export const info = createLogger('info', {
  id: '*',
  color: 'blueBright',
});

/** Writes a log line with a yellow `warn` prefix. */
export const warn = createLogger('warn', {
  id: '*',
  color: 'yellowBright',
  coloredText: true,
});

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

/** Writes a log line with a red X prefix. */
export const error = createLogger(logSymbols.error, {
  id: '*',
  color: 'redBright',
  coloredText: true,
  error: true,
});

/** Writes a log line with a cyan `debug` prefix. These are not visible by default. */
export const debug = createLogger('debug', {
  id: 'debug',
  color: 'cyanBright',
});

export const success = createLogger(logSymbols.success, {
  id: '*',
  color: 'greenBright',
  coloredText: true,
});

/** Writes raw line of text, but will do nothing if the log level is set to `LogLevel.Silent` */
export function writeLine(data: string) {
  clearWidgets();
  writeSync(STDOUT, data + '\n');
  redrawWidgets();
}
