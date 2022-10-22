# export-directory

This is a tool that manages `index.js` files within your project that re-export all the other files in the same directory, like:

```ts
// export-directory
export * from './file1';
export * from './file2';
export * from './file3';
export * from './types';
```

It's efficient (runs in under a quarter of a second), configurable, supports watch mode, and also contains as a rollup/vite plugin.

```
npm i -D export-directory
```

The CLI can be ran efficiently.

```sh
export-directory [root="./"] [options]
```

## Usage as a Rollup/Vite plugin

```ts
import exportDirectory from 'export-directory/rollup';

export default {
  ...
  plugins: [
    exportDirectory(),
  ],
};
```
