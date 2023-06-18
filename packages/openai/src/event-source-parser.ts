import { td } from './shared';

// const openBracket = '{'.charCodeAt(0);

// todo just make this an async iterator
export class OpenAIEventSource {
  running = false;

  constructor(public reader: ReadableStreamDefaultReader<Uint8Array>) {
    this.#cycle();
  }

  onData: (chunk: any) => void = () => {};
  // onNonStreamValue: (value: any) => void = () => {};

  queue: any[] = [];

  async #cycle() {
    if (this.running) {
      throw new Error('Already running');
    }
    this.running = true;
    let { reader } = this;
    try {
      let buf = '';
      let { done, value } = await reader.read();
      while (!done) {
        const lines = (buf + (typeof value === 'string' ? value : td.decode(value))).split('\n');
        buf = lines.pop()!;
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            this.onData(JSON.parse(line.slice(6)));
          }
        }
        ({ done, value } = await reader.read());
      }
      this.running = false;
    } finally {
      reader.releaseLock();
      (reader as any)?._destroy?.();
    }

    if (this.queue.length) {
      this.reader = this.queue.shift()!;
      this.#cycle();
    }
  }

  continue(newReader: ReadableStreamDefaultReader<Uint8Array>) {
    if (this.running) {
      this.queue.push(newReader);
    } else {
      this.reader = newReader;
      this.#cycle();
    }
  }
}
