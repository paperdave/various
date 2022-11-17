import chalk from 'chalk';
import { EmptyObject } from '@paperdave/utils';
import { Color } from './util';
import { LogWidget } from './widget';

export interface SpinnerOptions<Props extends Record<string, unknown>> {
  /** Text displayed to the right of the spinner. */
  text: string | ((props: Props) => string);
  /** Color of the spinner. */
  color?: Color | `${Color}` | false;
  /** Sequence of frames for the spinner. */
  frames?: string[];
  /** Frames per second of the Spinner. */
  fps?: number;
  /** Properties to be passed to the `text` formatting function. */
  props?: Props;
}

export const defaultSpinnerOptions = {
  text: 'Loading...',
  color: Color.BlueBright,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  fps: 12.5,
};

export class Spinner<Props extends Record<string, unknown> = EmptyObject> extends LogWidget {
  #text: string | ((props: Props) => string);
  #color: Color | `${Color}` | false;
  #frames: string[];
  #props: Props;
  protected fps: number;

  constructor(options: SpinnerOptions<Props> | string) {
    super();
    if (typeof options === 'string') {
      options = { text: options };
    }
    this.#text = options.text ?? defaultSpinnerOptions.text;
    this.#color = options.color ?? defaultSpinnerOptions.color;
    this.#frames = options.frames ?? defaultSpinnerOptions.frames;
    this.fps = options.fps ?? defaultSpinnerOptions.fps;
    this.#props = options.props ?? ({} as Props);
  }

  /** Text displayed to the right of the spinner. */
  get text(): string {
    return typeof this.#text === 'function' ? this.#text(this.#props) : this.#text;
  }

  set text(value: string | (() => string)) {
    this.#text = value;
    this.redraw();
  }

  /** Properties to be passed to `text` and `beforeText` formatting functions. */
  set props(value: Partial<Props>) {
    this.#props = {
      ...this.#props,
      ...value,
    };
    this.redraw();
  }

  get props(): Props {
    return {
      ...this.#props,
    };
  }

  /**
   * Updates the spinner by supplying either a new `message` string or a partial object of props to
   * be used by the custom message function.
   */
  update(newProps: Partial<Props>): void;
  update(newMessage: string): void;
  update(newData: string | Partial<Props>) {
    if (typeof newData === 'string') {
      this.text = newData;
    } else {
      this.#props = { ...this.#props, ...newData };
      this.redraw();
    }
  }

  protected format(now: number): string {
    const frame = Math.floor(now / (1000 / this.fps)) % this.#frames.length;

    return (
      (this.#color ? chalk[this.#color](this.#frames[frame]) : this.#frames[frame]) +
      ' ' +
      this.text
    );
  }

  success(message?: string): void {
    super.success(message ?? this.text);
  }

  error(message?: string | Error): void {
    super.error(message ?? this.text);
  }
}

export interface WithSpinnerOptions<Props extends Record<string, unknown>, T>
  extends SpinnerOptions<Props> {
  successText?: string | ((result: T) => string);
  failureText?: string | ((error: Error) => string);
}

/** Calls a function with a spinner. */
export async function withSpinner<Props extends Record<string, unknown>, T>(
  spinnerOptions: WithSpinnerOptions<Props, T> | string,
  fn: (spinner: Spinner<Props>) => Promise<T>
): Promise<T>;
export async function withSpinner(opts: any, fn: any) {
  const spinner = new Spinner(opts);

  try {
    const result = await fn(spinner);
    if (spinner.active) {
      spinner.success(
        opts.successText
          ? typeof opts.successText === 'function'
            ? opts.successText(result)
            : opts.successText
          : opts.text
          ? typeof opts.text === 'function'
            ? opts.text(spinner.props)
            : opts.text
          : 'Completed'
      );
    }
  } catch (error: any) {
    spinner.error(
      typeof opts.failureText === 'function' ? opts.failureText(error) : opts.failureText ?? error
    );
    throw error;
  }
}
