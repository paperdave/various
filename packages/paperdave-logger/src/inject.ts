import { debug, error, info, warn } from './log';

/**
 * Injects the logger into `globalThis.console`, or whatever is given. Only fills the following
 * functions: `log`, `info`, `warn`, `error`, `debug`.
 *
 * For accessing some special functions, use the `log` object directly.
 */
export function injectLogger(obj = console) {
  obj.log = info;
  obj.info = info;
  obj.warn = warn;
  obj.error = error;
  obj.debug = debug;
  // TODO: Add the rest of the `console` functions, such as `time`
}
