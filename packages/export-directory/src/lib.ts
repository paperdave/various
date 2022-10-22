import path from 'path';
import picomatch from 'picomatch';
import { chalk, Logger } from '@paperdave/logger';
import { asyncMap } from '@paperdave/utils';
import { watch } from 'chokidar';
import { readdir, readFile, writeFile } from 'fs/promises';
import type { Matcher } from 'picomatch';

const REGEX_CONTENT = /^\s*(?:\/\/|\/\*+)[ \t]*export-directory(?:[ \t](.*))?(?:\*\/[ \t]*)?$/;
const REGEX_INDEX = /index\.m?[tj]sx?$/;
const REGEX_SOURCE = /\.m?[tj]sx?$/;

export interface Action {
  filepath: string;
  content: string;
  update: boolean;
}

export interface Scan {
  sources: string[];
  actions: Action[];
}

export interface Options {
  quote?: 'double' | 'single';
  lineEnding?: 'auto' | 'lf' | 'crlf';
  semi?: boolean;
  ignore?: string[];
}

interface ResolvedOptions {
  quote: string;
  lineEnding: string;
  semi: string;
  ignore: Matcher[];
}

const defaultOptions: Options = {
  quote: 'single',
  semi: false,
  lineEnding: 'auto',
  ignore: ['node_modules', '.git', '*.test.*'],
};

async function scanExportDirectoryImpl(dir: string, opts: ResolvedOptions): Promise<Scan> {
  const files = (await readdir(dir, { withFileTypes: true })).filter(
    filename => !opts.ignore.some(matcher => matcher(filename.name))
  );

  const dirs = files.filter(x => x.isDirectory()).map(x => x.name);
  const subdirData = (
    await asyncMap(dirs, async subdir => {
      const { actions: entries, sources } = await scanExportDirectoryImpl(
        path.join(dir, subdir),
        opts
      );
      return {
        entries,
        sources: sources.map(x => path.join(subdir, x)),
      };
    })
  ).reduce(
    (a, b) => ({
      entries: a.entries.concat(b.entries),
      sources: a.sources.concat(b.sources),
    }),
    { entries: [], sources: [] }
  );
  const allSources = files.filter(x => x.isFile() && REGEX_SOURCE.test(x.name)).map(x => x.name);
  const indexes = allSources.filter(x => REGEX_INDEX.test(x));
  const sources = allSources.filter(x => !indexes.includes(x));
  const recursiveSources = sources.concat(subdirData.sources);

  const actions = await asyncMap(indexes, async index => {
    const filepath = path.join(dir, index);
    const read = await readFile(filepath, 'utf-8');
    const match = REGEX_CONTENT.exec(read.slice(0, read.indexOf('\n')));

    if (!match) {
      return null;
    }

    const optionList = match[1]
      ? match[1]
          .split(' ')
          .map(x => x.trim())
          .filter(Boolean)
      : [];

    const exclude: Matcher[] = [];
    const include: Matcher[] = [];
    let recursive = false;

    for (const option of optionList) {
      if (option.toLowerCase() === 'recursive') {
        recursive = true;
      } else if (option.toLowerCase().startsWith('exclude:')) {
        exclude.push(
          ...option
            .slice('exclude:'.length)
            .split(',')
            .map(str => picomatch(str))
        );
      } else if (option.toLowerCase().startsWith('include:')) {
        include.push(
          ...option
            .slice('include:'.length)
            .split(',')
            .map(str => picomatch(str))
        );
      } else {
        Logger.warn('Unknown option in %s: %s', filepath, option);
      }
    }

    const filteredFiles = (recursive ? recursiveSources : sources).filter(
      file =>
        (include.length ? include.some(matcher => matcher(file)) : true) &&
        !exclude.some(matcher => matcher(file))
    );

    const newContent = [
      match[0],
      ...filteredFiles
        .sort()
        .map(
          x =>
            `export * from ${opts.quote}./${x
              .slice(0, -path.extname(x).length)
              .replace(/\/index$/, '')}${opts.quote}${opts.semi}`
        ),
      '',
    ].join(opts.lineEnding);

    if (newContent !== read) {
      return {
        filepath,
        content: newContent,
        update: true,
      };
    }
    return { filepath, content: newContent, update: false };
  });

  return {
    sources: actions.some(Boolean) ? [indexes[actions.findIndex(Boolean)]] : sources,
    actions: (actions.filter(Boolean) as Action[]).concat(subdirData.entries),
  };
}

export async function scanExportDirectory(dir: string, opts: Options = {}) {
  opts = { ...defaultOptions, ignore: [], ...opts };
  opts.ignore!.unshift(...defaultOptions.ignore!);
  if (opts.lineEnding === 'auto') {
    opts.lineEnding = process.platform === 'win32' ? 'crlf' : 'lf';
  }
  const resolvedOptions: ResolvedOptions = {
    lineEnding: opts.lineEnding === 'lf' ? '\n' : '\r\n',
    quote: opts.quote === 'single' ? "'" : '"',
    semi: opts.semi ? ';' : '',
    ignore: opts.ignore!.map(x => picomatch(x)),
  };
  return scanExportDirectoryImpl(dir, resolvedOptions);
}

export async function exportDirectory(dir: string, opts: Options = {}) {
  const quietLogging = (opts as any).quiet;
  const start = performance.now();
  const actions = (await scanExportDirectory(dir, opts)).actions;
  actions.sort((a, b) => a.filepath.localeCompare(b.filepath));
  for (const action of actions) {
    if (!quietLogging || action.update) {
      Logger.writeLine(
        `${chalk.green(path.relative(dir, action.filepath))} ${
          action.update ? 'updated' : 'already up to date'
        }`
      );
    }

    if (action.update) {
      await writeFile(action.filepath, action.content);
    }
  }

  if (actions.length === 0 && !quietLogging) {
    Logger.warn('no files with an "// export-directory" comment.');
    Logger.warn("make sure it's placed on the first line of the file");
  }

  if (actions.some(x => x.update) || !quietLogging) {
    Logger.info(
      `export-directory ${(opts as any).rerun ? 're' : ''}run in %sms`,
      (performance.now() - start).toFixed(1)
    );
  }
}

export async function exportDirectoryWatch(dir: string, opts: Options = {}) {
  await exportDirectory(dir, opts);

  Logger.info('watching for changes');

  let running = false;
  const watcher = watch(dir, { ignoreInitial: true }).on('all', async () => {
    if (!running) {
      running = true;
      await exportDirectory(dir, { ...opts, quiet: true, rerun: true } as any);
      // eslint-disable-next-line require-atomic-updates
      running = false;
    }
  });

  return watcher;
}
