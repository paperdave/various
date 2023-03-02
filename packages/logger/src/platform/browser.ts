/* eslint-disable no-console */
const _console = { ...console };

export function platformWriteWidgetText() { }

export const platformWidgetEnabled = false;

export const platformWrite = {
  info: _console.log,
  error: _console.error,
  warn: _console.warn,
  debug: _console.debug,
};

export function platformSimplifyErrorPath(filepath: string) {
  return filepath;
}

export const platformUnicodeSupported = true;

export const builtinModules: string[] = [];
