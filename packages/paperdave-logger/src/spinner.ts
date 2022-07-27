import wrapAnsi from 'wrap-ansi';
import { ansi } from './ansi';
import { Color, wrapOptions } from './util';
import { LogWidget } from './widget';

export interface SpinnerOptions<Props extends Record<string, unknown>> {
  text: string | ((props: Props) => string);
  color?: Color | `${Color}` | false;
  frames?: string[];
  fps?: number;
  props?: Props;
}

export const defaultSpinnerOptions = {
  text: 'Loading...',
  color: Color.BlueBright,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  fps: 12.5,
};

export class Spinner<Props extends Record<string, unknown>> extends LogWidget {
  #text: string | ((props: Props) => string);
  color: Color | `${Color}` | false;
  fps: number;
  frames: string[];
  props: Props;

  constructor(options: SpinnerOptions<Props>) {
    super();
    this.#text = options.text ?? defaultSpinnerOptions.text;
    this.color = options.color ?? defaultSpinnerOptions.color;
    this.frames = options.frames ?? defaultSpinnerOptions.frames;
    this.fps = options.fps ?? defaultSpinnerOptions.fps;
    this.props = options.props ?? ({} as Props);
  }

  get text(): string {
    return typeof this.#text === 'function' ? this.#text(this.props) : this.#text;
  }

  set text(value: string | (() => string)) {
    this.#text = value;
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
      this.text = newData;
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
      wrapAnsi(this.text, 90 - 1 - this.frames[frame].length, wrapOptions)
    );
  }

  remove() {
    super.remove();
  }
}

export interface WithSpinnerOptions<Props extends Record<string, unknown>, T>
  extends SpinnerOptions<Props> {
  successText?: string | ((result: T) => string);
  failureText?: string | ((error: Error) => string);
}

export async function withSpinner<Props extends Record<string, unknown>, T>(
  fn: (spinner: Spinner<Props>) => Promise<T>,
  opts: WithSpinnerOptions<Props, T>
) {
  const spinner = new Spinner(opts);

  try {
    const result = await fn(spinner);
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
  } catch (error: any) {
    spinner.fail(
      typeof opts.failureText === 'function' ? opts.failureText(error) : opts.failureText ?? error
    );
    throw error;
  }
}
