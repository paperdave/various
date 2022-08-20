import { fs, nodeCrypto, path } from './native-module';

type BufferEncoding =
  | 'buffer'
  | 'utf8'
  | 'utf-8'
  | 'ascii'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'latin1'
  | 'binary';

/** @param {string} file */
export async function pathExists(file: string) {
  try {
    await fs.promises.access(file);
    return true;
  } catch (e) {
    return false;
  }
}

export interface WriteJSONOptions {
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
  replacer: Parameters<typeof JSON.stringify>[1];
}

export interface ReadJSONOptions {
  /**
   * A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  reviver?: Parameters<typeof JSON.parse>[1];
  /** Encoding of the file. Defaults to "utf8". */
  encoding?: BufferEncoding;
}

export function readJSONSync(file: string, options: ReadJSONOptions): unknown {
  return JSON.parse(fs.readFileSync(file, options?.encoding ?? 'utf-8'), options?.reviver);
}

export function writeJSONSync(file: string, data: unknown, options?: WriteJSONOptions) {
  fs.writeFileSync(file, JSON.stringify(data, options?.replacer as any, options?.spaces as any));
}

export async function readJSON(file: string, options: ReadJSONOptions): Promise<unknown> {
  return JSON.parse(
    await fs.promises.readFile(file, options?.encoding ?? 'utf-8'),
    options?.reviver
  );
}

export async function writeJSON(file: string, data: unknown, options?: WriteJSONOptions) {
  await fs.promises.writeFile(
    file,
    JSON.stringify(data, options?.replacer as any, options?.spaces as any)
  );
}

export async function ensureDir(file: string) {
  await fs.promises.mkdir(file, { recursive: true });
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
