import wrapAnsi from 'wrap-ansi';
import { ansi } from './ansi';
import { fail, success } from './log';
import { Color, wrapOptions } from './util';
import { LogWidget } from './widget';

export interface SpinnerOptions<Props extends Record<string, unknown>> {
  message: string | ((props: Props) => string);
  color: Color | `${Color}` | false;
  frames: string[];
  fps: number;
  props: Props;
}

const defaultOptions = {
  message: 'Loading...',
  color: Color.BlueBright,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  fps: 12.5,
};

export class Spinner<Props extends Record<string, unknown>> extends LogWidget {
  #message: string | ((props: Props) => string);
  color: Color | `${Color}` | false;
  fps: number;
  frames: string[];
  props: Props;

  constructor(options: Partial<SpinnerOptions<Props>> = {}) {
    super();
    this.#message = options.message ?? defaultOptions.message;
    this.color = options.color ?? defaultOptions.color;
    this.frames = options.frames ?? defaultOptions.frames;
    this.fps = options.fps ?? defaultOptions.fps;
    this.props = options.props ?? ({} as Props);
  }

  /** Either a string message, or a function to format a message with an optional props object. */
  get message(): string {
    return typeof this.#message === 'function' ? this.#message(this.props) : this.#message;
  }

  set message(value: string | (() => string)) {
    this.#message = value;
    this.redraw();
  }

  /**
   * Updates the spinner by supplying either a new `message` string or a partial object of props to
   * be used by the custom message function.
   */
  update(newProps: Partial<Props>): void;
  update(newMessage: string): void;
  update(newData: string | Partial<Props>) {
    if (typeof newData === 'string') {
      this.message = newData;
    } else {
      this.props = { ...this.props, ...newData };
      this.redraw();
    }
  }

  format(now: number): string {
    const frame = Math.floor(now / (1000 / this.fps)) % this.frames.length;

    return (
      (this.color ? ansi[this.color] + this.frames[frame] + ansi.reset : this.frames[frame]) +
      ' ' +
      wrapAnsi(this.message, 90 - 1 - this.frames[frame].length, wrapOptions)
    );
  }

  success(message?: string) {
    LogWidget.batchRedraw(() => {
      success(message ?? this.message);
      this.remove();
    });
  }

  fail(message?: string | Error) {
    LogWidget.batchRedraw(() => {
      fail(message ?? this.message);
      this.remove();
    });
  }

  remove() {
    super.remove();
  }
}

export interface WithSpinnerOptions<Props extends Record<string, unknown>, T>
  extends Partial<SpinnerOptions<Props>> {
  successMessage?: string | ((result: T) => string);
  failureMessage?: string | ((error: Error) => string);
}

export async function withSpinner<Props extends Record<string, unknown>, T>(
  fn: (spinner: Spinner<Props>) => Promise<T>,
  opts: WithSpinnerOptions<Props, T>
) {
  const spinner = new Spinner(opts);

  try {
    const result = await fn(spinner);
    spinner.success(
      opts.successMessage
        ? typeof opts.successMessage === 'function'
          ? opts.successMessage(result)
          : opts.successMessage
        : opts.message
        ? typeof opts.message === 'function'
          ? opts.message(spinner.props)
          : opts.message
        : 'Completed'
    );
  } catch (error: any) {
    spinner.fail(
      typeof opts.failureMessage === 'function'
        ? opts.failureMessage(error)
        : opts.failureMessage ?? error
    );
    throw error;
  }
}
