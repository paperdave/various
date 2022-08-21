# @paperdave/logger

## 2.2.3

### Patch Changes

- add MIT license ([`2347a98`](https://github.com/paperdave/various/commit/2347a9898d87c41010f82f7675664efab21edc77))

- Updated dependencies [[`2347a98`](https://github.com/paperdave/various/commit/2347a9898d87c41010f82f7675664efab21edc77)]:
  - @paperdave/utils@1.2.1

## 2.2.2

### Patch Changes

- fix missing dependency ([`16d8f33`](https://github.com/paperdave/various/commit/16d8f33f4664f194f297445b7ef3cf6e8af01e95))

## 2.2.0

### Minor Changes

- Add `trace` ([#32](https://github.com/paperdave/various/pull/32))

* All log functions accept and format error objects. ([#34](https://github.com/paperdave/various/pull/34))

- injection can handle uncaught errors automatically ([#32](https://github.com/paperdave/various/pull/32))

* deprecate `level`, `setLevel`, `LogLevel`, `fail`. ([#34](https://github.com/paperdave/various/pull/34))

- add custom namespaces using new `createLogger` function. ([#34](https://github.com/paperdave/various/pull/34))

  - all the built in log functions are created through this API.

* Add `trace`, `time`, `timeEnd`, `timeLog`, `count`, `countReset`, and `assert` to the injected console. ([#32](https://github.com/paperdave/various/pull/32))

- `error` now prints with an X symbol, and this is the standard for printing errors. ([#34](https://github.com/paperdave/various/pull/34))

  `success` is now seen as the opposite of an `error`. I used to say to avoid calling success too much, but with Spinners and Progress bars ending on a `success` check or `error` X message, these should probably be used more often, instead of `info` on a successful action being done.

### Patch Changes

- Explicitly define nodejs and bun version support. ([`5d0bd0d`](https://github.com/paperdave/various/commit/5d0bd0de6a8429802a66e393134a798b6ea2ff4f))

* injectConsole preferably takes an object instead of a console object, but this is not required yet. in v3, it will require for an object. ([#32](https://github.com/paperdave/various/pull/32))

- Add some badges to the readme indicating project status and release data ([`5d0bd0d`](https://github.com/paperdave/various/commit/5d0bd0de6a8429802a66e393134a798b6ea2ff4f))

* removed line wrapping ([#34](https://github.com/paperdave/various/pull/34))

- proper writing to standard error for errors and warnings and interactive content ([#34](https://github.com/paperdave/various/pull/34))

## 2.1.0

### Minor Changes

- switch from using internal ansi library to `chalk@4` ([`9334160`](https://github.com/paperdave/various/commit/933416077f4201e52b9f4bebeec93cae0350deab))

### Patch Changes

- Fix `fail` writing to stdin instead of stdout ([`257963a`](https://github.com/paperdave/various/commit/257963a4d6572402b0ef904a6cf7978cf56b5c21))

* fix error stack traces printing a weird symbol in some consoles ([`9334160`](https://github.com/paperdave/various/commit/933416077f4201e52b9f4bebeec93cae0350deab))

## 2.0.6

### Patch Changes

- Using ES6 instead of ES2020 to prevent usage of nullish coalescing operator ([#28](https://github.com/paperdave/various/pull/28))

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
