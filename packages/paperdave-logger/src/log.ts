import wrapAnsi from 'wrap-ansi';
import { writeSync } from 'node:fs';
import { ansi, colorize } from './ansi';
import { formatErrorObj } from './error';
import { level, LogLevel } from './level';
import { logSymbols } from './unicode';
import { PREFIX_LENGTH, STDOUT, stringify, wrapOptions } from './util';
import { clearWidgets, redrawWidgets } from './widget';

function logPrefixed(prefix: string, content: string) {
  clearWidgets();

  if (content === '') {
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
    logPrefixed(`${ansi.blueBright}${ansi.bold}info  ${ansi.reset}`, stringify(...data));
  }
}

/** Writes a log line with a yellow `warn` prefix. */
export function warn(...data: any[]) {
  if (level >= LogLevel.Warn) {
    logPrefixed(
      `${ansi.yellowBright}${ansi.bold}warn  ${ansi.reset}`,
      colorize(ansi.yellowBright, stringify(...data))
    );
  }
}

/**
 * Writes a log line with a red `error` prefix. Accepts an `Error` or `PrintableError` in addition
 * to standard text, in which case it will print the error in a pretty way.
 */
export function error(...data: any[]) {
  if (level >= LogLevel.Error) {
    logPrefixed(
      `${ansi.redBright}${ansi.bold}error ${ansi.reset}`,
      data.length === 1 && data[0] instanceof Error
        ? formatErrorObj(data[0])
        : colorize(ansi.redBright, stringify(...data))
    );
  }
}

/** Writes a log line with a cyan `debug` prefix. These are not visible by default. */
export function debug(...data: any[]) {
  if (level >= LogLevel.Debug) {
    logPrefixed(`${ansi.cyanBright}${ansi.bold}debug ${ansi.reset}`, stringify(...data));
  }
}

/** Writes a log line in all green and with a checkmark prefix. */
export function success(...data: any[]) {
  if (level >= LogLevel.Info) {
    const str = stringify(...data);

    clearWidgets();
    if (str === '') {
      writeSync(0, '\n');
    } else {
      writeSync(
        0,
        wrapAnsi(
          colorize(ansi.green + ansi.bold, logSymbols.success + ' ' + str),
          90,
          wrapOptions
        ) + '\n'
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
      writeSync(0, '\n');
    } else {
      writeSync(
        0,
        wrapAnsi(colorize(ansi.red + ansi.bold, logSymbols.error + ' ' + str), 90, wrapOptions) +
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
