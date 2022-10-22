# Various Web Stuff

<div>
<img alt="Discord" src="https://img.shields.io/discord/516410163230539837?label=discord">
</div>

This is a monorepo of various libraries and programs I've authored, all surrounding TypeScript and other web technologies. A handful of them are published under the `@paperdave` namespace, but not a hard requirement. Most of the packages are reusable utilities for my other projects, as well as configurations. I use a monorepo so I don't have dozens of repositories on GitHub, and I can centralize the automation and workflow- It makes my life easier.

All packages target:

- Latest LTS Node (>=16)
- The latest release of Bun (>=0.1)
- "relatively up-to-date" browsers.

The exception of the above would be packages that don't make sense in some environments, such as reading a file from a browser, or doing something DOM-oriented inside of Bun or Node.

<!-- START-README-TABLE -->

| Package | Status | Description |
| --- | --- | --- |
| [![npm](https://img.shields.io/npm/v/eslint-config-dave.svg?label=eslint-config-dave)](https://www.npmjs.com/package/eslint-config-dave) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | Extremely thorough, but opinionated ESLint config. |
| [![npm](https://img.shields.io/npm/v/prettier-config-dave.svg?label=prettier-config-dave)](https://www.npmjs.com/package/prettier-config-dave) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | Extremely thorough, but opinionated Prettier config. |
| [![npm](https://img.shields.io/npm/v/@paperdave/utils.svg?label=%40paperdave%2Futils)](https://www.npmjs.com/package/@paperdave/utils) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | Common utility functions and TypeScript types. |
| [![npm](https://img.shields.io/npm/v/@paperdave/events.svg?label=%40paperdave%2Fevents)](https://www.npmjs.com/package/@paperdave/events) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | Another event emitter library, with easy TS types. |
| [![npm](https://img.shields.io/npm/v/@paperdave/logger.svg?label=%40paperdave%2Flogger)](https://www.npmjs.com/package/@paperdave/logger) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | Versitle logging with spinners and progress bars. |
| [![npm](https://img.shields.io/npm/v/export-directory.svg?label=export-directory)](https://www.npmjs.com/package/export-directory) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | automatically manage index.js files that export all files in the directory |
| [![npm](https://img.shields.io/npm/v/nodun.svg?label=nodun)](https://www.npmjs.com/package/nodun) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | tricks programs to run js with bun instead of node.js |
| [![npm](https://img.shields.io/npm/v/rollup-plugin-all-external.svg?label=rollup-plugin-all-external)](https://www.npmjs.com/package/rollup-plugin-all-external) | [![brightgreen](https://img.shields.io/badge/status-stable-brightgreen.svg)](#project-status-meaning) | Simple plugin to set externals for libraries. |

<!-- END-README-TABLE -->

## project status meaning

| Status | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| Stable | Ready to use and maintained by me.                                     |
| LTS    | I will fix bugs, but likely not add features .                         |
| Dead   | I will likely not work on this at all, but still accept contributions. |
| WIP    | The package is still in development. Will not even be on NPM           |

## contributing

- use pnpm for deps. (will switch to bun once workspaces are stable)
- use changesets for making changelogs.
- run eslint and prettier before opening a pr.
- don't write bad code.
- i'm pretty chill in this repo so don't worry.

## license

[Everything here is under MIT](./LICENSE)
