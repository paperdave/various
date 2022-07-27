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
      widgetTimer = setInterval(redrawWidgets, 1000 / 60);
      writeSync(STDOUT, ansi.hide);
    }
  }

  /**
   * Returns a string of what the widget looks like. Called 15 times per second to allow for smooth
   * animation. The value passed to now is the result of `performance.now`.
   */
  abstract format(now: number): string;
  abstract fps: number;

  /** Removes this widget from the log. */
  protected remove(finalMessage?: string) {
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
      writeSync(STDOUT, ansi.show);
    } else {
      redrawWidgets();
    }
  }

  /** Forces an update to happen immediately. */
  protected update() {
    this.#nextUpdate = 0;
    redrawWidgets();
  }

  #nextUpdate = 0;
  #text = '';
  #newlines = 0;

  /** @internal */
  private __internalUpdate(now: number) {
    if (now > this.#nextUpdate) {
      this.#nextUpdate = this.fps === 0 ? Infinity : now + 1000 / this.fps;
      const text = this.format(now);
      if (text !== this.#text) {
        this.#text = text + '\n';
        this.#newlines = text.split('\n').length;
      }
      return true;
    }
    return false;
  }

  /** @interal */
  private __internalGetText() {
    widgetLineCount += this.#newlines;
    return this.#text;
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

  const now = performance.now();
  const hasUpdate = widgets.filter(widget => widget['__internalUpdate'](now)).length > 0;

  if (hasUpdate || widgetLineCount === 0) {
    clearWidgets();
    writeSync(STDOUT, widgets.map(widget => widget['__internalGetText']()).join(''));
  }
}
