const codes: Record<string, string> = {
  r: '\x1b[0m', // reset
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  black: '\x1b[30m',
  b: '\x1b[1m', // bold
  d: '\x1b[2m', // dim
  i: '\x1b[3m', // italic
  u: '\x1b[4m', // underline
};

function pretty(strings: TemplateStringsArray, ...args: any[]) {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i].replace(/<(\w+)>/g, (_, code) => codes[code] ?? `<${code}>`);
    if (i < args.length) {
      result += args[i];
    }
  }
  return result;
}

console.log(pretty`Hello <red>World<r>!`);
console.log(pretty`Hello <green>${Math.random()}<r>!`);
console.log(pretty`Hello <b><cyan>${"can't inject <red>"}<r>!`);
