import * as log from './log';

export * from './deprecated';
export { CLIError, type PrintableError } from './error';
export { injectLogger } from './inject';
export { LogLevel, setLevel } from './level';
export * from './log';
export { createLogger } from './log-base';
export {
  BarStyle,
  Progress,
  withProgress,
  type BarSpinnerOptions,
  type ProgressOptions,
  type WithProgressOptions,
} from './progress';
export { Spinner, withSpinner, type SpinnerOptions } from './spinner';
export type { CustomLoggerColor, CustomLoggerOptions, LogFunction, StringLike } from './types';
export { isUnicodeSupported, logSymbols } from './unicode';
export { LogWidget } from './widget';
export default log;
