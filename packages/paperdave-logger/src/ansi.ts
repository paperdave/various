import supportsColor from 'supports-color';

/** A mini ansi-formatting library. */
export const ansi = {
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underlined: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  reset: '\x1b[0m',
  resetBold: '\x1b[21m',
  resetDim: '\x1b[22m',
  resetUnderlined: '\x1b[24m',
  resetBlink: '\x1b[25m',
  resetReverse: '\x1b[27m',
  resetHidden: '\x1b[28m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  blackBright: '\x1b[90m',
  redBright: '\x1b[91m',
  greenBright: '\x1b[92m',
  yellowBright: '\x1b[93m',
  blueBright: '\x1b[94m',
  magentaBright: '\x1b[95m',
  cyanBright: '\x1b[96m',
  whiteBright: '\x1b[97m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgBlackBright: '\x1b[100m',
  bgRedBright: '\x1b[101m',
  bgGreenBright: '\x1b[102m',
  bgYellowBright: '\x1b[103m',
  bgBlueBright: '\x1b[104m',
  bgMagentaBright: '\x1b[105m',
  bgCyanBright: '\x1b[106m',
  bgWhiteBright: '\x1b[107m',

  up(n: number) {
    return n === 0 ? '' : n === 1 ? `\x1b[A` : `\x1b[${n}A`;
  },
  down(n: number) {
    return n === 0 ? '' : n === 1 ? `\x1b[B` : `\x1b[${n}B`;
  },
  forward(n: number) {
    return n === 0 ? '' : n === 1 ? `\x1b[C` : `\x1b[${n}C`;
  },
  backward(n: number) {
    return n === 0 ? '' : n === 1 ? `\x1b[D` : `\x1b[${n}D`;
  },

  clearLine: '\x1b[2K',

  show: '\x1b[?25h',
  hide: '\x1b[?25l',
};

if (!supportsColor.stdout) {
  Object.keys(ansi).forEach(key => {
    (ansi as any)[key] = typeof ansi[key as keyof typeof ansi] === 'function' ? () => '' : '';
  });
}

export function colorize(color: string, str: string) {
  return color + str.replaceAll(ansi.reset, ansi.reset + color) + ansi.reset;
}
