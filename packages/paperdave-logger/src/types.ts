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

export interface CustomLoggerOptions {
  id?: string;
  color?: CustomLoggerColor;
  coloredText?: boolean;
  boldText?: boolean;
  level?: number;
  error?: boolean;
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
  <S extends LogData>(fmt?: S, ...data: ProcessFormatString<S>): void;
  (): void;
  visible: boolean;
  name: string;
}
