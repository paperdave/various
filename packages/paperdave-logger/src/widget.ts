import { writeSync } from 'fs';
import { ansi } from './ansi';
import type { Timer } from './util';
import { STDOUT } from './util';

const widgets: LogWidget[] = [];
let widgetLineCount = 0;
let widgetTimer: Timer | undefined;

/**
 * A Log Widget is a piece of log content that is held at the bottom of the console log, and can be
 * animated/dynamically updated. It is used to create spinners, progress bars, and other rich visuals.
 */
export abstract class LogWidget {
  constructor() {
    widgets.push(this);

    if (!widgetTimer) {
      widgetTimer = setInterval(redrawWidgets, 1000 / 15);
    }
  }

  /**
   * Returns a string of what the widget looks like. Called 15 times per second to allow for smooth
   * animation. The value passed to now is the result of `performance.now`.
   */
  abstract format(now: number): string;

  /** Removes this widget from the log. */
  remove(finalMessage?: string) {
    const index = widgets.indexOf(this);
    if (index >= 0) {
      widgets.splice(index, 1);
    }
    clearWidgets();
    if (finalMessage) {
      writeSync(STDOUT, finalMessage + '\n');
    }
    if (widgets.length === 0) {
      clearInterval(widgetTimer);
      widgetTimer = undefined;
    }
    redrawWidgets();
  }
}

export function clearWidgets() {
  if (widgetLineCount) {
    writeSync(
      STDOUT,
      ansi.clearLine + (ansi.up(1) + ansi.clearLine).repeat(widgetLineCount) + '\r'
    );
    widgetLineCount = 0;
  }
}

export function redrawWidgets() {
  if (!widgetTimer) {
    return;
  }

  clearWidgets();
  const now = performance.now();
  for (const w of widgets) {
    const str = w.format(now);
    writeSync(STDOUT, str);
    widgetLineCount += str.split('\n').length;
    writeSync(STDOUT, '\n');
  }
}
