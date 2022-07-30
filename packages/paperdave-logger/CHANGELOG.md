# @paperdave/logger

## 2.0.5

### Patch Changes

- Ability to use custom prefix ([#23](https://github.com/paperdave/various/pull/23))

## 2.0.4

### Patch Changes

- fix: write to the correct fd ([`a6d9b3f`](https://github.com/paperdave/various/commit/a6d9b3fb0040a18300c6b7c9d1fdd30f88b7d3ca))

## 2.0.3

### Patch Changes

- allow errors to be passed to `fail`, and also style them slightly nicer ([`2bc98a3`](https://github.com/paperdave/various/commit/2bc98a33e12367cf4968adda0a76f5f05667fe07))

## 2.0.2

### Patch Changes

- update readme/metadata ([`83afd2a`](https://github.com/paperdave/various/commit/83afd2a419e32fe3f9c7e55f756fb063eb9257ca))

* Fixed typos, and added commas ([#15](https://github.com/paperdave/various/pull/15))

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
