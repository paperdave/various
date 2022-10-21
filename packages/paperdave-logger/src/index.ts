export * from './deprecated';
export { LogWidget } from './widget';
export { CLIError, type PrintableError } from './error';
export { setLogFilter } from './filter';
export { injectLogger } from './inject';
export * from './log';
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
export { default, default as Logger } from './default-export';

// These two modules are only shipped in ESM, but we bundle them so commonjs imports work fine,
// and might as well export bindings to the base libraries for ease of use.
export { default as chalk } from 'chalk';
export * as ansiEscapes from 'ansi-escapes';
