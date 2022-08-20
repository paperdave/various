import * as logBuiltins from './log';
import { createLogger } from './log-base';
import type { CustomLoggerOptions, LogFunction } from './types';

type LogConstructor = {
  /**
   * Creates a logger function with a psuedo-random color based off the namespace.
   *
   * A custom color can be assigned by doing any of the following:
   *
   * - Passing a color argument with a color name "blue"
   * - Passing a color argument with a hex value "#0000FF"
   * - Passing a color argument with an ANSI 256 palette value (0-255)
   * - Passing a color argument with a RGB value [0, 0, 255]
   * - Using chalk or another formatter on the namespace name.
   */
  new (name: string, options?: CustomLoggerOptions): LogFunction;
  /**
   * Creates a logger function with a psuedo-random color based off the namespace.
   *
   * A custom color can be assigned by doing any of the following:
   *
   * - Passing a color argument with a color name "blue"
   * - Passing a color argument with a hex value "#0000FF"
   * - Passing a color argument with an ANSI 256 palette value (0-255)
   * - Passing a color argument with a RGB value [0, 0, 255]
   * - Using chalk or another formatter on the namespace name.
   */
  (name: string, options?: CustomLoggerOptions): LogFunction;
} & typeof logBuiltins;

for (const key in logBuiltins) {
  (createLogger as any)[key] = (logBuiltins as any)[key];
}

/**
 * The logger class contains static methods for basic logging operations, but can be constructed to
 * create custom loggers.
 */
export default createLogger as unknown as LogConstructor;
