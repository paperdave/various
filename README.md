# various typescript libraries

<div>
<img alt="Discord" src="https://img.shields.io/discord/516410163230539837?label=discord">
</div>

This is a monorepo of various packages I've authored. A handful of them are published under the `@paperdave` namespace, but not a hard requirement. Most of the packages are reusable utilities for my other projects, as well as configurations. I use a monorepo so I don't have dozens of repositories on GitHub, and I can centralize the automation and workflow- It makes my life easier.

All packages target:

- Latest LTS Node (>=16)
- The latest release of Bun (>=0.1)
- "relatively up-to-date" browsers.

The exception of the above would be packages that don't make sense in some environments, such as reading a file from a browser, or doing something DOM-oriented inside of Bun or Node.

<!-- START-README-TABLE -->

| Package | Status | Description |
| --- | --- | --- |
| [![npm](https://img.shields.io/npm/v/eslint-config-dave.svg?label=eslint-config-dave)](https://www.npmjs.com/package/eslint-config-dave) | [![grey](https://img.shields.io/badge/status-unknown-grey.svg)](#project-status-meaning) | Extremely thorough, but opinionated ESLint config. |
| [![npm](https://img.shields.io/npm/v/prettier-config-dave.svg?label=prettier-config-dave)](https://www.npmjs.com/package/prettier-config-dave) | [![grey](https://img.shields.io/badge/status-unknown-grey.svg)](#project-status-meaning) | Extremely thorough, but opinionated Prettier config. |
| [![npm](https://img.shields.io/npm/v/@paperdave/utils.svg?label=%40paperdave%2Futils)](https://www.npmjs.com/package/@paperdave/utils) | [![grey](https://img.shields.io/badge/status-unknown-grey.svg)](#project-status-meaning) | Common utility functions and TypeScript types. |
| [![npm](https://img.shields.io/npm/v/@paperdave/events.svg?label=%40paperdave%2Fevents)](https://www.npmjs.com/package/@paperdave/events) | [![grey](https://img.shields.io/badge/status-unknown-grey.svg)](#project-status-meaning) | Another event emitter library, with easy TS types. |
| [![npm](https://img.shields.io/npm/v/@paperdave/logger.svg?label=%40paperdave%2Flogger)](https://www.npmjs.com/package/@paperdave/logger) | [![grey](https://img.shields.io/badge/status-unknown-grey.svg)](#project-status-meaning) | Versitle logging with spinners and progress bars. |

<!-- END-README-TABLE -->

## project status meaning

| Status | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| Stable | Ready to use and maintained by me.                                     |
| LTS    | I will fix bugs, but likely not add features .                         |
| Dead   | I will likely not work on this at all, but still accept contributions. |
| WIP    | The package is still in development. Will not even be on NPM           |

## contributing
