import wrapAnsi from 'wrap-ansi';
import { writeSync } from 'fs';
import { error } from './log';
import { STDOUT } from './util';
import { clearWidgets, redrawWidgets } from './widget';

/** @deprecated This function will be removed in the future. use the named functions instead. */
export function log(prefix: string, content: string, force = false) {
  clearWidgets();

  if (content === '' && !force) {
    writeSync(STDOUT, '\n');
    return;
  }

  const wrapped = wrapAnsi(content, 90 - 6, { trim: false, hard: true }) //
    .replace(/\n\s*/g, '\n' + ' '.repeat(6));

  writeSync(STDOUT, prefix + wrapped + '\n');

  redrawWidgets();
}

/**
 * Writes a log line in all red and with a cross prefix.
 *
 * @deprecated Use `error` instead.
 */
export function fail(...data: any[]) {
  error(...data);
}
