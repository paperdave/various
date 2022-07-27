import type { EmptyObject } from '@paperdave/types';
import { ansi } from './ansi';
import { convertHSVtoRGB } from './hsv';
import { defaultSpinnerOptions } from './spinner';
import { isUnicodeSupported } from './unicode';
import type { Color } from './util';
import { LogWidget } from './widget';

const boxChars = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];
const fullBox = '█';
const asciiChars = {
  start: '[',
  end: ']',
  empty: ' ',
  fill: '=',
};

/**
 * This function is derrived from an old program I wrote back in 2020 called `f` which did ffmpeg
 * handling. It is probably one of the coolest progress bars ever imagined. The original had the HSL
 * colors baked in, but this one doesn't do that.
 *
 * For those interested:
 * https://github.com/paperdave/f/blob/fcc418f11c7abe979ec01d90d5fdf7e50fb6ec25/src/render.ts.
 */
function getUnicodeBar(progress: number, width: number) {
  if (progress >= 1) {
    return fullBox.repeat(width);
  }
  if (progress <= 0 || isNaN(progress)) {
    return ' '.repeat(width);
  }

  const wholeWidth = Math.floor(progress * width);
  const remainderWidth = (progress * width) % 1;
  const partWidth = Math.floor(remainderWidth * 8);
  let partChar = boxChars[partWidth];
  if (width - wholeWidth - 1 < 0) {
    partChar = '';
  }

  const fill = fullBox.repeat(wholeWidth);
  const empty = ' '.repeat(width - wholeWidth - 1);

  return `${fill}${partChar}${empty}`;
}

/** Get an ascii progress bar. Boring. */
function getAsciiBar(progress: number, width: number) {
  return [
    asciiChars.start,
    asciiChars.fill.repeat(Math.floor(progress * (width - 2))),
    asciiChars.empty.repeat(width - Math.ceil(progress * (width - 2))),
    asciiChars.end,
  ].join('');
}

export enum BarStyle {
  Unicode = 'unicode',
  Ascii = 'ascii',
}

export interface ProgressOptions<Props extends Record<string, unknown> = EmptyObject> {
  text: string | ((props: ExtendedProps<Props>) => string);
  beforeText?: string | ((props: ExtendedProps<Props>) => string);
  props?: Props;
  barWidth?: number;
  barStyle?: BarStyle | `${BarStyle}`;
  spinner?: Partial<BarSpinnerOptions> | null;
  value?: number;
  total?: number;
}

export interface BarSpinnerOptions {
  fps: number;
  frames: string[];
  color: Color | `${Color}` | 'match';
}

const defaultOptions = {
  beforeText: '',
  barWidth: 35,
  barColor: 'rgb',
  barStyle: BarStyle.Unicode,
  spinner: {
    ...defaultSpinnerOptions,
    color: 'match',
  },
  value: 0,
  total: 100,
} as const;

type ExtendedProps<T> = Omit<T, 'value' | 'total' | 'progress'> & {
  value: number;
  total: number;
  progress: number;
};

export class Progress<Props extends Record<string, unknown>> extends LogWidget {
  #text: string | ((props: ExtendedProps<Props>) => string);
  #beforeText: string | ((props: ExtendedProps<Props>) => string);
  barWidth: number;
  barStyle: NonNullable<ProgressOptions['barStyle']>;
  spinnerColor: NonNullable<BarSpinnerOptions['color']>;
  spinnerFrames?: string[];
  #props: Props;
  fps: number;
  spinnerFPS: number;
  #value: number;
  #total: number;

  constructor(options: ProgressOptions<Props>) {
    super();

    this.#text = options.text;
    this.#beforeText = options.beforeText ?? defaultOptions.beforeText;
    this.barWidth = options.barWidth ?? defaultOptions.barWidth;
    this.barStyle = options.barStyle ?? defaultOptions.barStyle;
    this.#props = options.props ?? ({} as Props);
    this.#value = options.value ?? defaultOptions.value;
    this.#total = options.total ?? defaultOptions.total;

    // Undefined will trigger the "no spinner"
    // eslint-disable-next-line eqeqeq
    if (options.spinner !== null) {
      this.fps = 15;
      this.spinnerFPS = options.spinner?.fps ?? defaultOptions.spinner.fps;
      this.spinnerFrames = options.spinner?.frames ?? defaultOptions.spinner.frames;
      this.spinnerColor = options.spinner?.color ?? defaultOptions.spinner.color;
    } else {
      this.fps = 0;
      this.spinnerFPS = defaultOptions.spinner.fps;
      this.spinnerFrames = undefined;
      this.spinnerColor = defaultOptions.spinner.color;
    }
  }

  set props(value: Partial<Props>) {
    this.#props = {
      ...this.#props,
      ...value,
    };
  }

  get props(): ExtendedProps<Props> {
    return {
      ...this.#props,
      value: this.#value,
      total: this.#total,
      progress: this.#total === 0 ? 1 : this.#value / this.#total,
    };
  }

  get text(): string {
    return typeof this.#text === 'function' ? this.#text(this.props) : this.#text;
  }

  set text(value: string | (() => string)) {
    this.#text = value;
    this.redraw();
  }

  get beforeText(): string {
    return typeof this.#beforeText === 'function' ? this.#beforeText(this.props) : this.#beforeText;
  }

  set beforeText(value: string | (() => string)) {
    this.#beforeText = value;
    this.redraw();
  }

  get value() {
    return this.value;
  }

  set value(value: number) {
    this.#value = value;
    this.redraw();
  }

  get total() {
    return this.value;
  }

  set total(value: number) {
    this.#total = value;
    this.redraw();
  }

  format(now: number): string {
    const progress = this.#total === 0 ? 1 : this.#value / this.#total;

    const hue = Math.min(Math.max(progress, 0), 1) / 3;
    const barColor =
      ansi.rgb(...convertHSVtoRGB(hue, 0.8, 1)) + //
      ansi.bgRgb(...convertHSVtoRGB(hue, 0.8, 0.5));

    let spinner;
    if (this.spinnerFrames) {
      const frame = Math.floor(now / (1000 / this.spinnerFPS)) % this.spinnerFrames.length;
      spinner = this.spinnerColor
        ? (this.spinnerColor === 'match'
            ? ansi.rgb(...convertHSVtoRGB(hue, 0.8, 1))
            : ansi[this.spinnerColor]) +
          this.spinnerFrames[frame] +
          ansi.reset
        : this.spinnerFrames[frame];
    }

    const getBar = isUnicodeSupported && this.barStyle === 'unicode' ? getUnicodeBar : getAsciiBar;

    const beforeText = this.beforeText;

    return [
      spinner ? spinner + ' ' : '',
      beforeText ? beforeText + ' ' : '',
      barColor,
      getBar(progress, this.barWidth),
      ansi.reset,
      ' ',
      this.text,
    ]
      .filter(Boolean)
      .join('');
  }

  success(message?: string): void {
    super.success(message ?? this.text);
  }

  fail(message?: string | Error): void {
    super.fail(message ?? this.text);
  }
}

export interface WithProgressOptions<Props extends Record<string, unknown>, T>
  extends ProgressOptions<Props> {
  successMessage?: string | ((result: T) => string);
  failureMessage?: string | ((error: Error) => string);
}

export async function withProgress<Props extends Record<string, unknown>, T>(
  fn: (bar: Progress<Props>) => Promise<T>,
  opts: WithProgressOptions<Props, T>
) {
  const bar = new Progress(opts);

  try {
    const result = await fn(bar);
    bar.success(
      opts.successMessage
        ? typeof opts.successMessage === 'function'
          ? opts.successMessage(result)
          : opts.successMessage
        : opts.text
        ? typeof opts.text === 'function'
          ? opts.text(bar.props)
          : opts.text
        : 'Completed'
    );
  } catch (error: any) {
    bar.fail(
      typeof opts.failureMessage === 'function'
        ? opts.failureMessage(error)
        : opts.failureMessage ?? error
    );
    throw error;
  }
}
