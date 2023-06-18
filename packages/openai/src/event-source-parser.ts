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

  async #cycle() {
    if (this.running) {
      throw new Error('Already running');
    }
    this.running = true;
    let { reader } = this;
    try {
      let buf = '';
      // let isFirst = true;
      let { done, value } = await reader.read();
      while (!done) {
        // if (isFirst) {
        //   if (value![0] === openBracket) {
        //     const parse = JSON.parse(td.decode(value));
        //     this.running = false;
        //     this.onNonStreamValue(parse);

        //     let done2;
        //     while (!done2) done2 = (await reader.read()).done;
        //     return;
        //   }
        //   isFirst = false;
        // }

        const lines = (buf + td.decode(value)).split('\n');
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
    }
  }

  continue(newReader: ReadableStreamDefaultReader<Uint8Array>) {
    if (this.running) throw new Error('Already running');
    this.reader = newReader;
    this.#cycle();
  }
}
