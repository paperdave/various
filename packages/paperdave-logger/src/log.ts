import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import { writeSync } from 'node:fs';
import { formatErrorObj, formatStackTrace } from './error';
import { level, LogLevel } from './level';
import { logSymbols } from './unicode';
import { PREFIX_LENGTH, STDOUT, stringify, wrapOptions } from './util';
import { clearWidgets, redrawWidgets } from './widget';

/**
 * Writes a log line with a custom prefix.
 *
 * @deprecated This function will be removed in the future. use the named functions instead.
 */
export function log(prefix: string, content: string, force = false) {
  clearWidgets();

  if (content === '' && !force) {
    writeSync(STDOUT, '\n');
    return;
  }

  const wrapped = wrapAnsi(content, 90 - PREFIX_LENGTH, wrapOptions) //
    .replace(/\n\s*/g, '\n' + ' '.repeat(PREFIX_LENGTH));

  writeSync(STDOUT, prefix + wrapped + '\n');

  redrawWidgets();
}

/** Writes a log line with a blue `info` prefix. */
export function info(...data: any[]) {
  if (level >= LogLevel.Info) {
    log(chalk.blueBright.bold('info  '), stringify(...data));
  }
}

/** Writes a log line with a yellow `warn` prefix. */
export function warn(...data: any[]) {
  if (level >= LogLevel.Warn) {
    log(chalk.yellowBright.bold('warn  '), chalk.yellowBright(stringify(...data)));
  }
}

/** Writes a log line with a yellow `warn` prefix. */
export function trace(...data: any[]) {
  if (level >= LogLevel.Info) {
    log(chalk.yellowBright.bold('trace '), chalk.yellowBright(stringify(...data)), true);
    writeSync(STDOUT, formatStackTrace(new Error()).split('\n').slice(1).join('\n') + '\n');
  }
}

/**
 * Writes a log line with a red `error` prefix. Accepts an `Error` or `PrintableError` in addition
 * to standard text, in which case it will print the error in a pretty way.
 */
export function error(...data: any[]) {
  if (level >= LogLevel.Error) {
    log(
      chalk.redBright.bold('error '),
      data.length === 1 && data[0] instanceof Error
        ? formatErrorObj(data[0])
        : chalk.redBright(stringify(...data))
    );
  }
}

/** Writes a log line with a cyan `debug` prefix. These are not visible by default. */
export function debug(...data: any[]) {
  if (level >= LogLevel.Debug) {
    log(chalk.cyanBright.bold('debug'), stringify(...data));
  }
}

/** Writes a log line in all green and with a checkmark prefix. */
export function success(...data: any[]) {
  if (level >= LogLevel.Info) {
    const str = stringify(...data);

    clearWidgets();
    if (str === '') {
      writeSync(STDOUT, '\n');
    } else {
      writeSync(
        STDOUT,
        wrapAnsi(chalk.green.bold(logSymbols.success + ' ' + str), 90, wrapOptions) + '\n'
      );
    }
    redrawWidgets();
  }
}

/** Writes a log line in all red and with a cross prefix. */
export function fail(...data: any[]) {
  if (level >= LogLevel.Info) {
    const str = stringify(...data);

    clearWidgets();
    if (str === '') {
      writeSync(STDOUT, '\n');
    } else {
      writeSync(
        STDOUT,
        data.length === 1 && data[0] instanceof Error
          ? formatErrorObj(data[0], true)
          : wrapAnsi(chalk.red.bold(logSymbols.error + ' ' + stringify(...data)), 90, wrapOptions) +
              '\n'
      );
    }
    redrawWidgets();
  }
}

/** Writes raw line of text, but will do nothing if the log level is set to `LogLevel.Silent` */
export function writeLine(data: string) {
  if (level > LogLevel.Silent) {
    clearWidgets();
    writeSync(STDOUT, data + '\n');
    redrawWidgets();
  }
}
