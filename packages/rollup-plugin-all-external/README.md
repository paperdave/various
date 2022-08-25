# rollup-plugin-all-external

<div>
<a href="https://github.com/paperdave/various#project-status-meaning"><img alt="Status: WIP" src="https://img.shields.io/badge/status-wip-red"></a>
<a href="https://www.npmjs.com/package/rollup-plugin-all-external"><img alt="NPM Version" src="https://img.shields.io/npm/v/rollup-plugin-all-external.svg?label=latest%20release"></a>
</div>
<br>

This rollup plugin marks node builtins, bun builtins, and everything in a `node_modules` directory as external. As opposed to the `rollup-plugin-node-builtins` plugin, this plugin does not mark `node_modules` as external.

You probably also want to install `@rollup/plugin-node-resolve` or else installed dependencies like `fs-extra` wont be picked up.

## Usage

```ts
import external from 'rollup-plugin-all-external';

export default {
  // ...
  plugins: [
    external()
  ]
};
```
