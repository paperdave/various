import path from 'path';
import { isRootDirectory, pathExists, unique } from '@paperdave/utils';
import type { FSWatcher } from 'chokidar';
import type { Plugin } from 'rollup';
import type { Options } from './lib';
import { exportDirectory, exportDirectoryWatch } from './lib';

export default function exportDirectoryRollup(opts: Options): Plugin {
  let sourceRoots: string[] = [];

  const watchers = new Set<FSWatcher>();
  return {
    name: 'export-directory',
    async buildStart({ input }) {
      if (watchers.size > 0) {
        return;
      }

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
      for (const root of sourceRoots) {
        if (this.meta.watchMode) {
          watchers.add(await exportDirectoryWatch(root, opts));
        } else {
          await exportDirectory(root, opts);
        }
      }
    },
    closeWatcher() {
      for (const watcher of watchers) {
        watcher.close();
      }
      watchers.clear();
    },
  };
}
