export type CustomLoggerColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'
  | 'blackBright'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright'
  | `#${string}`
  | number
  | [number, number, number];

export type LogType = 'info' | 'warn' | 'debug' | 'error';

export interface CustomLoggerOptions {
  id?: string;
  color?: CustomLoggerColor;
  coloredText?: boolean;
  boldText?: boolean;
  level?: number;
  type?: LogType;
  debug?: boolean;
}

/** Matches `string`, `number`, and other objects with a `.toString()` method. */
export interface StringLike {
  toString(): string;
}

export interface FormatStringArgs {
  '%s': StringLike | null | undefined;
  '%d': number | null | undefined;
  '%i': number | null | undefined;
  '%f': number | null | undefined;
  '%x': number | null | undefined;
  '%X': number | null | undefined;
  '%o': any;
  '%O': any;
  '%c': string | null | undefined;
  '%j': any;
}

export type ProcessFormatString<S> = S extends `${string}%${infer K}${infer B}`
  ? `%${K}` extends keyof FormatStringArgs
    ? [FormatStringArgs[`%${K}`], ...ProcessFormatString<B>]
    : ProcessFormatString<B>
  : [];

export type LogData = string | number | boolean | object | null | undefined;

export interface LogFunction {
  /**
   * Writes data to the log. The first argument can be a printf-style format string, or usage
   * similar to `console.log`. Handles formatting objects including `Error` objects with pretty
   * colorized stack traces.
   *
   * List of formatters:
   *
   * - %s - String.
   * - %d, %f - Number.
   * - %i - Integer.
   * - %x - Hex.
   * - %X - Hex (uppercase)
   * - %o - Object.
   * - %O - Object (pretty printed).
   * - %j - JSON.
   */
  <S extends LogData>(data?: S, ...a: ProcessFormatString<S>): void;
  /** Calling a logger function with no arguments prints a blank line. */
  (): void;

  visible: boolean;
  name: string;
}
