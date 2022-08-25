import type { Plugin } from 'rollup';
import { builtinModules } from './list';

const name = 'rollup-plugin-all-external';

function external(): Plugin {
  return {
    name,
    options(inputOptions) {
      // As of writing, `options` is allowed to push MORE plugins, which is what we NEED in order to
      // set a `pre` and `post` function on the same hook. We do this explicit ordering so the end
      // user can specify the plugins in any order and still get desired results.
      (inputOptions.plugins ??= []).push(
        {
          name: name + ':pre',
          resolveId: {
            order: 'pre',
            handler(source) {
              // Handle obviously external modules such as "path" and "fs", but also bun related
              if (builtinModules.includes(source)) {
                return { id: 'node:' + source, external: true };
              }
              if (source === 'bun' || source.startsWith('bun:') || source.startsWith('node:')) {
                return { id: source, external: true };
              }
              return null;
            },
          },
        },
        // This is run AFTER all other plugins, so paths of stuff like `esbuild` are resolved
        // to the exact file.
        {
          name: name + ':post',
          resolveId: {
            order: 'post',
            handler(source) {
              if (source.split('/').includes('node_modules')) {
                return { id: source, external: true };
              }
              return null;
            },
          },
        }
      );

      return inputOptions;
    },
  };
}

export default external;
export { external };
