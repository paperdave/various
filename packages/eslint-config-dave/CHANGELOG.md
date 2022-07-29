# eslint-config-dave

## 3.0.8

### Patch Changes

- Modified ([`e7da5e4`](https://github.com/paperdave/various/commit/e7da5e40e24cfd80eb6c63a2dd16d0213212e905))

  - set eslint `curly` rule to `multi-or-nest`, allowing `if (...) return;`
  - allow empty `catch` blocks
  - disable the non-typescript `require-await` rule
  - disable `@typescript-eslint/explicit-module-boundary-types`
  - disable `@typescript-eslint/no-empty-interface`
  - disable `@typescript-eslint/no-invalid-void-type`
  - disable `@typescript-eslint/no-misused-promises`
  - disable `@typescript-eslint/no-redeclare`
  - disable `@typescript-eslint/no-redundant-type-constituents`

## 3.0.7

### Patch Changes

- update readme/metadata ([`83afd2a`](https://github.com/paperdave/various/commit/83afd2a419e32fe3f9c7e55f756fb063eb9257ca))

## 3.0.6

### Patch Changes

- fix: `fetch().then(x => x.json())` no longer gets marked as a lint error
  ([`76b4c77`](https://github.com/paperdave/various/commit/76b4c77ba813fff24d04074a366f628df28fe5e7))

## 3.0.5

### Patch Changes

- 96510dd: fix no-redeclare

## 3.0.4

### Patch Changes

- 153228b: add typescript-eslint rules

## 3.0.3

### Patch Changes

- make all peer dependencies normal, since package managers do not follow peerDependenciesMeta, at
  least for nested stuff. i'm tired of the stupid install warning

## 3.0.2

### Patch Changes

- fbce85e: set dependencies as optional

## 3.0.1

### Patch Changes

- 89a90cb: disable 'curly' rule

## 3.0.0

### Major Changes

- d2413fb: initial set of basic davecode config and utilities
