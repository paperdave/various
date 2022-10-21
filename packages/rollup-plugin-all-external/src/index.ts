import path from 'path';
import { isRootDirectory, pathExists, unique } from '@paperdave/utils';
import type { Plugin } from 'rollup';
import { builtinModules } from './list';

function external(): Plugin {
  let sourceRoots: string[] = [];
  return {
    name: 'rollup-plugin-all-external',
    async options({ input }) {
      const inputFiles =
        typeof input === 'string'
          ? [input]
          : Array.isArray(input)
          ? input
          : input
          ? Object.values(input)
          : [];
      for (const file of inputFiles) {
        let dir = path.resolve(process.cwd(), file);
        while (dir && !isRootDirectory(dir)) {
          if (await pathExists(path.join(dir, 'package.json'))) {
            sourceRoots.push(dir);
            break;
          }
          dir = path.dirname(dir);
        }
      }
      sourceRoots = unique(sourceRoots);
    },
    resolveId(id) {
      // Handle obviously external modules such as "path" and "fs", but also bun related ones too
      if (builtinModules.includes(id)) {
        return { id: 'node:' + id, external: true };
      }
      if (id === 'bun' || id.startsWith('bun:') || id.startsWith('node:')) {
        return { id, external: true };
      }

      // Node modules are external
      if (id.split('/').includes('node_modules')) {
        return { id, external: true };
      }

      // If detected a source root, external everything outside of it. This is used
      // for monorepo situations where stuff gets bundled since their true filepath is
      // outside of node_modules.
      if (
        sourceRoots.length &&
        id.startsWith('/') &&
        !sourceRoots.some(root => id.startsWith(root))
      ) {
        return { id, external: true };
      }

      return null;
    },
  };
}

export default external;
export { external };
