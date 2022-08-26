// The following implementation only works on Bun.
// @ts-expect-error TODO: install this if we decide to use
import { exec } from 'bun-utilities/spawn';
import { read, readSync } from 'fs';

const buffer = new Uint8Array(1);
const decoder = new TextDecoder();

export function getKeySync(echo = false): string | null {
  exec(['stty', '-icanon', ...(echo ? [] : ['-echo'])]);
  try {
    const len = readSync(0, buffer);
    exec(['stty', 'icanon', 'echo']);
    if (len === 0) {
      return null;
    }
    return decoder.decode(buffer);
  } catch (error) {
    exec(['stty', 'icanon', 'echo']);
    throw error;
  }
}

/** Is not async until non blocking fs is implemented. */
export async function getKey(echo = false) {
  return await new Promise((resolve, reject) => {
    exec(['stty', '-icanon', ...(echo ? [] : ['-echo'])]);
    // @ts-expect-error Bun Types Wrong Lol
    read(0, buffer, (err, len) => {
      exec(['stty', 'icanon', 'echo']);
      if (err) {
        reject(err);
        return;
      }
      if (len === 0) {
        resolve(null);
      }
      resolve(decoder.decode(buffer));
    });
  });
}
