/// <reference types="bun-types" />
export interface PrintableError extends Error {
    description: string;
    hideStack?: boolean;
    hideName?: boolean;
}
interface Logger {
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(error: Error | PrintableError): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    success(...data: any[]): void;
    writeRaw(data: string): void;
    writeRawLine(data: string): void;
    setShowDebug(showDebug: boolean): void;
}
export declare const log: Logger;
/**
 * When this error is passed to `log.error`, it will be printed with a custom long-description. This
 * is useful to give users a better description on what the error actually is. Does not show a stack
 * trace by default.
 *
 * ```ts
 * new CLIError(
 *   'Invalid config file',
 *   `Please check your config file at ${chalk.cyan(config)} and try again.`
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
export declare function injectLogger(obj?: console): void;
export {};
