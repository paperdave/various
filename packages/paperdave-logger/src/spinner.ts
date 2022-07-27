import wrapAnsi from 'wrap-ansi';
import { ansi } from './ansi';
import { Color, wrapOptions } from './util';
import { LogWidget } from './widget';

export interface SpinnerOptions {
  message: string | (() => string);
  color: Color | false;
  frames: string[];
  fps: number;
}

const defaultOptions = {
  message: 'Loading...',
  color: Color.BlueBright,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  fps: 12.5,
};

export class Spinner extends LogWidget {
  #message: string | (() => string);
  color: Color | `${Color}` | false;
  fps: number;
  frames: string[];

  constructor(options: Partial<SpinnerOptions> = {}) {
    super();
    this.#message = options.message ?? defaultOptions.message;
    this.color = options.color ?? defaultOptions.color;
    this.frames = options.frames ?? defaultOptions.frames;
    this.fps = options.fps ?? defaultOptions.fps;
  }

  get message(): string {
    return typeof this.#message === 'function' ? this.#message() : this.#message;
  }

  set message(value: string | (() => string)) {
    this.#message = value;
  }

  format(now: number): string {
    const frame = Math.floor(now / (1000 / this.fps)) % this.frames.length;
    const c = this.color ? ansi[this.color] : '';

    return (
      (this.color ? ansi[this.color] + this.frames[frame] + ansi.reset : this.frames[frame]) +
      ' ' +
      wrapAnsi(this.message, 90 - 1 - this.frames[frame].length, wrapOptions)
    );
  }
}
