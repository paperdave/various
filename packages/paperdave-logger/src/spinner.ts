import { ansi } from './ansi';
import { LogWidget } from './widget';

const DEFAULT_SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const DEFAULT_SPINNER_COLOR = ansi.blueBright + ansi.bold;

function resolveArray(x: string | string[] | (() => string | string[])) {
  if (typeof x === 'function') {
    x = x();
  }
  if (typeof x === 'string') {
    return x;
  }
  return x.join('');
}

function resolve(x: string | (() => string)) {
  return typeof x === 'function' ? x() : x;
}

export interface SpinnerOptions {
  message: string | (() => string);
  color: string | string[] | (() => string | string[]);
}

export class Spinner extends LogWidget {
  message: string | (() => string);
  color: string | string[] | (() => string | string[]);
  fps = 15;

  constructor(options: Partial<SpinnerOptions> = {}) {
    super();
    this.message = options.message ?? 'Loading...';
    this.color = options.color ?? DEFAULT_SPINNER_COLOR;
  }

  format(now: number): string {
    const frame = Math.floor(now / (1000 / this.fps)) % DEFAULT_SPINNER.length;

    const c = resolveArray(this.color);
    const m = resolve(this.message);
    return `${c}${DEFAULT_SPINNER[frame]}${ansi.reset} ${m}`;
  }
}
