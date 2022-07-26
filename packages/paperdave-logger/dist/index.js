// src/index.ts
import path from "path";
import wrapAnsi from "wrap-ansi";
import { inspect } from "util";

// src/ansi.ts
import supportsColor from "supports-color";
var ansi = {
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  underlined: "\x1B[4m",
  blink: "\x1B[5m",
  reverse: "\x1B[7m",
  hidden: "\x1B[8m",
  reset: "\x1B[0m",
  resetBold: "\x1B[21m",
  resetDim: "\x1B[22m",
  resetUnderlined: "\x1B[24m",
  resetBlink: "\x1B[25m",
  resetReverse: "\x1B[27m",
  resetHidden: "\x1B[28m",
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  bgBlack: "\x1B[40m",
  bgRed: "\x1B[41m",
  bgGreen: "\x1B[42m",
  bgYellow: "\x1B[43m",
  bgBlue: "\x1B[44m",
  bgMagenta: "\x1B[45m",
  bgCyan: "\x1B[46m",
  bgWhite: "\x1B[47m",
  blackBright: "\x1B[90m",
  redBright: "\x1B[91m",
  greenBright: "\x1B[92m",
  yellowBright: "\x1B[93m",
  blueBright: "\x1B[94m",
  magentaBright: "\x1B[95m",
  cyanBright: "\x1B[96m",
  whiteBright: "\x1B[97m",
  bgBlackBright: "\x1B[100m",
  bgRedBright: "\x1B[101m",
  bgGreenBright: "\x1B[102m",
  bgYellowBright: "\x1B[103m",
  bgBlueBright: "\x1B[104m",
  bgMagentaBright: "\x1B[105m",
  bgCyanBright: "\x1B[106m",
  bgWhiteBright: "\x1B[107m"
};
if (!supportsColor.stdout) {
  Object.keys(ansi).forEach((key) => {
    ansi[key] = "";
  });
}
function colorize(color, str) {
  return color + str.replaceAll(ansi.reset, ansi.reset + color) + ansi.reset;
}

// src/index.ts
var showDebug = typeof process !== "undefined" && !!process.env.DEBUG;
var PREFIX_LENGTH = 6;
var wrapOptions = {
  trim: false,
  hard: true
};
var write = typeof Bun !== "undefined" ? (data) => Bun.write(Bun.stdout, data) : (data) => process.stdout.write(data);
function writeLine(data) {
  write(data + "\n");
}
function stringify(...data) {
  return data.map((obj) => typeof obj === "string" ? obj : inspect(obj, false, 4, true)).join(" ");
}
function logPrefixed(prefix, content) {
  if (content === "") {
    write("\n");
    return;
  }
  const wrapped = wrapAnsi(content, 90 - 6, wrapOptions).replace(/\n\s*/g, "\n" + " ".repeat(PREFIX_LENGTH));
  write(prefix + wrapped + "\n");
}
function formatStackTrace(err) {
  if (!err.stack) {
    return "";
  }
  const v8firstLine = `${err.name}${err.message ? ": " + err.message : ""}
`;
  const parsed = err.stack.startsWith(v8firstLine) ? err.stack.slice(v8firstLine.length).split("\n").map((line) => {
    const match = /at (.*) \((.*):(\d+):(\d+)\)/.exec(line);
    if (!match) {
      return { method: "<unknown>", file: null, line: null, column: null };
    }
    return {
      method: match[1],
      file: match[2],
      line: parseInt(match[3], 10),
      column: parseInt(match[4], 10),
      native: line.includes("[native code]")
    };
  }) : err.stack.split("\n").map((line) => {
    const at = line.indexOf("@");
    const method = line.slice(0, at);
    const file = line.slice(at + 1);
    const fileSplit = /^(.*?):(\d+):(\d+)$/.exec(file);
    return {
      method: (["module code"].includes(method) ? "" : method) || "",
      file: fileSplit ? fileSplit[1] : null,
      line: fileSplit ? parseInt(fileSplit[2], 10) : null,
      column: fileSplit ? parseInt(fileSplit[3], 10) : null,
      native: file === "[native code]"
    };
  });
  const firstNative = parsed.reverse().findIndex((line) => !line.native);
  if (firstNative !== -1) {
    parsed.splice(0, firstNative, {
      native: true,
      method: "",
      column: null,
      line: null,
      file: null
    });
  }
  parsed.reverse();
  return parsed.map(({ method, file, line, column, native }) => {
    const source = native ? `[native code]` : file ? [
      ansi.cyan,
      path.dirname(file),
      path.sep,
      ansi.greenBright,
      path.basename(file),
      ansi.reset,
      ansi.blackBright,
      ":",
      ansi.reset,
      ansi.yellowBright,
      line,
      ansi.reset,
      ansi.blackBright,
      ":",
      ansi.redBright,
      column
    ].join("") : "<unknown>";
    return `\u200B  ${ansi.blackBright}at ${method === "" ? "" : `${method} `}${source}`;
  }).join("\n");
}
function formatErrorObj(err) {
  const { name, message, description, hideStack, hideName, stack } = err;
  return [
    ansi.redBright,
    hideName ? "" : (name ?? "Error") + ": ",
    message ?? "Unknown error",
    ansi.reset,
    description ? "\n" + wrapAnsi(description, 90 - 6, wrapOptions) : "",
    hideStack || !stack ? "" : "\n" + formatStackTrace(err),
    description || !hideStack && stack ? "\n" : ""
  ].join("");
}
var log = {
  info: (...data) => logPrefixed(`${ansi.blueBright}${ansi.bold}info  ${ansi.reset}`, stringify(...data)),
  warn: (...data) => logPrefixed(`${ansi.yellowBright}${ansi.bold}warn  ${ansi.reset}`, colorize(ansi.yellowBright, stringify(...data))),
  error(...data) {
    logPrefixed(`${ansi.redBright}${ansi.bold}error ${ansi.reset}`, data.length === 1 && data[0] instanceof Error ? formatErrorObj(data[0]) : colorize(ansi.redBright, stringify(...data)));
  },
  debug(...data) {
    if (showDebug) {
      logPrefixed(`${ansi.cyanBright}${ansi.bold}debug ${ansi.reset}`, stringify(...data));
    }
  },
  success(...data) {
    const str = stringify(...data);
    if (str === "") {
      write("\n");
    } else {
      write(wrapAnsi(colorize(ansi.green + ansi.bold, "\u2714 " + str), 90, wrapOptions) + "\n");
    }
  },
  writeRaw: write,
  writeRawLine: writeLine,
  setShowDebug(show) {
    showDebug = show;
  }
};
var CLIError = class extends Error {
  constructor(message, description) {
    super(message);
    this.message = message;
    this.description = description;
    this.name = "CLIError";
  }
  get hideStack() {
    return true;
  }
  get hideName() {
    return true;
  }
};
function injectLogger(obj = console) {
}
export {
  CLIError,
  injectLogger,
  log
};
//# sourceMappingURL=index.js.map
