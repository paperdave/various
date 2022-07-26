/** Enum of log level names to their level ID. */
export declare enum LogLevel {
    /** Print nothing. */
    Silent = 0,
    /** Print only errors. */
    Error = 1,
    /** Print warnings and errors. */
    Warn = 2,
    /** Print all non-debug, the default. */
    Info = 3,
    /** Print everything. Default is `process.env.DEBUG` is set to true. */
    Debug = 4
}
/** Either a LogLevel or a string key of the LogLevel. */
declare type SetLevelInput = LogLevel | Lowercase<keyof typeof LogLevel>;
/**
 * A Printable Error is an error that defines some extra fields. `@paperdave/logger` handles these
 * objects within logs which allows customizing their appearance. It can be useful when building
 * CLIs to throw formatted error objects that instruct the user what they did wrong, without
 * printing a huge piece of text with a useless stack trace.
 *
 * @see {CLIError} an easy class to construct these objects.
 */
export interface PrintableError extends Error {
    description: string;
    hideStack?: boolean;
    hideName?: boolean;
}
export interface Logger {
    /** Writes a log line with a blue `info` prefix. */
    info(...data: any[]): void;
    /** Writes a log line with a yellow `warn` prefix. */
    warn(...data: any[]): void;
    /**
     * Writes a log line with a yellow `error` prefix. Accepts an `Error` or `PrintableError` in
     * addition to standard text, in which case it will print the error in a pretty way.
     */
    error(error: Error | PrintableError): void;
    /**
     * Writes a log line with a yellow `error` prefix. Accepts an `Error` or `PrintableError` in
     * addition to standard text, in which case it will print the error in a pretty way.
     */
    error(...data: any[]): void;
    /** Writes a log line with a cyan `debug` prefix. These are not visible by default. */
    debug(...data: any[]): void;
    /** Writes a log line in all green and with a checkmark prefix. */
    success(...data: any[]): void;
    /** Writes raw text, but will do nothing if the log level is set to `LogLevel.Silent` */
    writeRaw(data: string): void;
    /** Writes raw line of text, but will do nothing if the log level is set to `LogLevel.Silent` */
    writeRawLine(data: string): void;
    /** Sets the log level. Accepts a `LogLevel` enum or a string. */
    setLevel(level: SetLevelInput): void;
}
/** An opiniated logger object. */
export declare const log: Logger;
/**
 * When this error is passed to `log.error`, it will be printed with a custom long-description. This
 * is useful to give users a better description on what the error actually is. Does not show a stack
 * trace by default.
 *
 * For example, in Purplet we throw this error if the `$DISCORD_BOT_TOKEN` environment variable is missing.
 *
 * ```ts
 * new CLIError(
 *   'Missing DISCORD_BOT_TOKEN environment variable!',
 *   dedent`
 *     Please create an ${chalk.cyan('.env')} file with the following contents:
 *
 *     ${chalk.cyanBright('DISCORD_BOT_TOKEN')}=${chalk.grey('<your bot token>')}
 *
 *     You can create or reset your bot token at ${devPortalLink}
 *   `
 * );
 * ```
 */
export declare class CLIError extends Error implements PrintableError {
    message: string;
    description: string;
    constructor(message: string, description: string);
    get hideStack(): boolean;
    get hideName(): boolean;
}
/**
 * Injects the logger into `globalThis.console`, or whatever is given. Only fills the following
 * functions: `log`, `info`, `warn`, `error`, `debug`.
 *
 * For accessing some special functions, use the `log` object directly.
 */
export declare function injectLogger(obj?: Console): void;
export {};
