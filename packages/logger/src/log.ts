import { platformWrite } from '$platform';
import { formatStackTrace } from './error';
import { createLogger } from './log-base';
import { logSymbols } from './unicode';
import { clearWidgets, redrawWidgets } from './widget';

/** Built in blue "info" logger. */
export const info = createLogger('info', {
  color: 'blueBright',
});

/** Built in yellow "warn" logger. */
export const warn = createLogger('warn', {
  color: 'yellowBright',
  coloredText: true,
});

const _trace = createLogger('trace', {
  color: 208,
  type: 'error',
});

/** Built in orange "trace" logger. Prints a stack trace after the message. */
export const trace = function trace(...data: any[]) {
  if (_trace.visible) {
    _trace(...(data.length === 0 ? [' '] : data));
    platformWrite.error(formatStackTrace(new Error()).split('\n').slice(1).join('\n'));
  }
} as typeof _trace;
Object.defineProperty(trace, 'visible', { get: () => _trace.visible });

/** Built in red "error" logger, uses a unicode X instead of the word Error. */
export const error = createLogger(logSymbols.error, {
  id: 'error',
  color: 'redBright',
  coloredText: true,
  boldText: true,
  type: 'error',
});

/** Built in cyan "debug" logger. */
export const debug = createLogger('debug', {
  color: 'cyanBright',
  debug: true,
});

/** Built in green "success" logger, uses a unicode Check instead of the word Success. */
export const success = createLogger(logSymbols.success, {
  id: 'success',
  color: 'greenBright',
  coloredText: true,
  boldText: true,
});

/** Writes raw line of text without a prefix or filtering. Does NOT support formatting features. */
export function writeLine(message = '') {
  clearWidgets();
  platformWrite.info(message);
  redrawWidgets();
}
