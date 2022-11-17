import type * as YAML from 'yaml';
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';
import { fs, nodeCrypto, path } from './native-module';

type BufferEncoding = 'utf8' | 'utf-8' | 'ascii' | 'utf16le' | 'ucs2' | 'ucs-2' | 'latin1';

/** @param {string} file */
export async function pathExists(file: string) {
  try {
    await fs.promises.access(file);
    return true;
  } catch (e) {
    return false;
  }
}

export interface FileWriteOptionsBase {
  /** Encoding of the file. Defaults to "utf8". */
  encoding?: BufferEncoding;
  /** Mode of the file. Defaults to 0o666. */
  mode?: number;
  /**
   * Flag of the file. Defaults to "w",
   * {@link https://nodejs.org/api/fs.html#file-system-flags List of all flags on nodejs.org}.
   */
  flag?: string;
  /** Whether to create the directory if it doesn't exist. */
  mkdir?: boolean;
}
export interface FileReadOptionsBase {
  /** Encoding of the file. Defaults to "utf8". */
  encoding?: BufferEncoding;
  /**
   * Flag of the file. Defaults to "r",
   * {@link https://nodejs.org/api/fs.html#file-system-flags List of all flags on nodejs.org}.
   */
  flag?: string;
}

export interface WriteJSONOptions extends FileWriteOptionsBase {
  /**
   * Adds indentation, white space, and line break characters to the return-value JSON text to make
   * it easier to read.
   */
  spaces?: number | boolean;
  /**
   * Either:
   *
   * - An array of strings and numbers that acts as an approved list for selecting the object
   *   properties that will be stringified.
   * - A function that transforms the results.
   */
  replacer?: Parameters<typeof JSON.stringify>[1];
}

export interface ReadJSONOptions<T = unknown> extends FileReadOptionsBase {
  /**
   * A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  reviver?: Parameters<typeof JSON.parse>[1];
  /** If the file does not exist, return this value instead. */
  default?: T | (() => T);
}

export interface WriteYAMLOptions
  extends FileWriteOptionsBase,
    YAML.DocumentOptions,
    YAML.SchemaOptions,
    YAML.ParseOptions,
    YAML.CreateNodeOptions,
    YAML.ToStringOptions {}

export interface ReadYAMLOptions<T = unknown>
  extends FileReadOptionsBase,
    YAML.ParseOptions,
    YAML.DocumentOptions,
    YAML.SchemaOptions,
    YAML.ToJSOptions {
  /** If the file does not exist, return this value instead. */
  default?: T | (() => T);
}

export function readJSONSync<T>(file: string, options: ReadJSONOptions<T> = {}): T {
  try {
    // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
    const fsOpts = { encoding: options.encoding ?? 'utf8' };
    if (options.flag) {
      // @ts-expect-error .
      fsOpts.flag = flag;
    }
    return JSON.parse(fs.readFileSync(file, fsOpts), options?.reviver);
  } catch (error) {
    if ('default' in options) {
      return typeof options.default === 'function'
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          (options.default as Function)()
        : options.default;
    }
    throw error;
  }
}

export async function ensureDir(file: string) {
  await fs.promises.mkdir(file, { recursive: true });
}

export function ensureDirSync(file: string) {
  fs.mkdirSync(file, { recursive: true });
}

export function writeJSONSync<T>(file: string, data: T, options: WriteJSONOptions = {}) {
  if (options.mkdir) {
    ensureDirSync(path.dirname(file));
  }
  // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
  const fsOpts: any = { encoding: options.encoding ?? 'utf8' };
  if (options.mode) {
    fsOpts.mode = options.mode;
  }
  if (options.flag) {
    fsOpts.flag = options.flag;
  }
  fs.writeFileSync(
    file,
    JSON.stringify(data, options.replacer as any, options.spaces as any),
    fsOpts
  );
}

export async function readJSON<T>(file: string, options: ReadJSONOptions<T> = {}): Promise<T> {
  try {
    return JSON.parse(
      await fs.promises.readFile(file, {
        encoding: options?.encoding ?? 'utf8',
        flag: options?.flag,
      }),
      options?.reviver
    );
  } catch (error) {
    if ('default' in options) {
      return typeof options.default === 'function'
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          (options.default as Function)()
        : options.default;
    }
    throw error;
  }
}

export async function writeJSON<T>(file: string, data: T, options: WriteJSONOptions = {}) {
  if (options.mkdir) {
    await ensureDir(path.dirname(file));
  }

  // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
  const fsOpts: any = { encoding: options.encoding ?? 'utf8' };
  if (options.mode) {
    fsOpts.mode = options.mode;
  }
  if (options.flag) {
    fsOpts.flag = options.flag;
  }

  await fs.promises.writeFile(
    file,
    JSON.stringify(data, options.replacer as any, options.spaces as any),
    options
  );
}

export function readYAMLSync<T>(file: string, options: ReadYAMLOptions = {}): T {
  const { encoding, flag, default: def, ...yamlOptions } = options;
  try {
    // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
    const fsOpts = { encoding: encoding ?? 'utf8' };
    if (flag) {
      // @ts-expect-error .
      fsOpts.flag = flag;
    }
    return parseYAML(fs.readFileSync(file, fsOpts), yamlOptions);
  } catch (error) {
    if ('default' in options) {
      return typeof def === 'function'
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          (def as Function)()
        : def;
    }
    throw error;
  }
}

export function writeYAMLSync<T>(file: string, data: T, options: WriteYAMLOptions = {}) {
  const { encoding, mode, flag, mkdir, ...yamlOptions } = options;
  if (mkdir) {
    ensureDirSync(path.dirname(file));
  }

  // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
  const fsOpts: any = { encoding: encoding ?? 'utf8' };
  if (mode) {
    fsOpts.mode = mode;
  }
  if (flag) {
    fsOpts.flag = flag;
  }

  fs.writeFileSync(file, stringifyYAML(data, yamlOptions), fsOpts);
}

export async function readYAML<T>(file: string, options: ReadYAMLOptions = {}): Promise<T> {
  const { encoding, flag, default: def, ...yamlOptions } = options;
  try {
    // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
    const fsOpts = { encoding: encoding ?? 'utf8' };
    if (flag) {
      // @ts-expect-error .
      fsOpts.flag = flag;
    }

    return parseYAML(await fs.promises.readFile(file, fsOpts), yamlOptions);
  } catch (error) {
    if ('default' in options) {
      return typeof def === 'function'
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          (def as Function)()
        : def;
    }
    throw error;
  }
}

export async function writeYAML<T>(file: string, data: T, options: WriteYAMLOptions = {}) {
  const { encoding, mode, flag, mkdir, ...yamlOptions } = options;
  if (mkdir) {
    await ensureDir(path.dirname(file));
  }

  // This cannot be inlined due to https://github.com/oven-sh/bun/issues/1516
  const fsOpts: any = { encoding: encoding ?? 'utf8' };
  if (mode) {
    fsOpts.mode = mode;
  }
  if (flag) {
    fsOpts.flag = flag;
  }

  await fs.promises.writeFile(file, stringifyYAML(data, yamlOptions), fsOpts);
}

export interface WalkOptions {
  directories?: boolean;
  files?: boolean;
}

/** Returns an async iterator over all files in a folder. */
export async function* walk(root: string, opts: WalkOptions = {}): AsyncIterable<string> {
  root = path.resolve(root);
  const { directories = true, files = true } = opts;

  for (const file of await fs.promises.readdir(root)) {
    const filepath = path.join(root, file);
    const isDirectory = (await fs.promises.stat(filepath)).isDirectory();
    if ((isDirectory && directories) || (!isDirectory && files)) {
      yield filepath;
    }
    if (isDirectory) {
      yield* walk(filepath, opts);
    }
  }
}

type HashEncoding = 'base64' | 'hex' | 'binary' | 'buffer';

export interface HashDirectoryOptions<Format extends HashEncoding = HashEncoding> {
  format?: Format;
  algorithm?: string;
}

/**
 * Hash all of the contents of a given directory.
 *
 * **currently node.js only**
 */
export async function hashDirectoryContents(
  root: string,
  options?: HashDirectoryOptions<'binary'>
): Promise<Uint8Array>;
export async function hashDirectoryContents(
  root: string,
  options: HashDirectoryOptions
): Promise<string>;
export async function hashDirectoryContents(
  root: string,
  options: HashDirectoryOptions = {}
): Promise<any> {
  root = path.resolve(root);
  const sha1 = nodeCrypto.createHash(options.algorithm ?? 'sha1');

  const blobs: Array<Promise<Uint8Array>> = [];

  for await (const file of walk(root, { directories: false })) {
    blobs.push(fs.promises.readFile(file));
  }

  for (const blob of await Promise.all(blobs)) {
    sha1.update(blob);
  }

  if (options.format && options.format !== 'buffer') {
    return sha1.digest(options.format);
  }
  return sha1.digest();
}

export function isRootDirectory(str: string) {
  return str === '/' || (str.length === 3 && str.endsWith(':\\'));
}
