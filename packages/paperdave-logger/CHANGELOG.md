# @paperdave/logger

## 2.0.0

### Major Changes

- breaking: removed `log` export, it is a `default` export now, also top level function exports.
- breaking: `log.setShowDebug` is `setLevel` now.

## Minor Changes

- feat: spinners
- feat: progress bars
- feat: `.fail` log function
- feat: `colors` export
- feat: `isUnicodeSupported` export
- feat: `logSymbols` export
- might be some more, sorry.

## Patch Changes

- fix: on bun writing and exiting the process immediatly will always print the text now.

## 1.0.0

Initial release
