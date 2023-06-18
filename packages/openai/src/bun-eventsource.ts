// @ts-nocheck
// https://github.com/oven-sh/bun/blob/77d498e3ce618875ac03daa89f5a6264a78fc827/src/js/builtins/EventSource.ts
// i heavily edited this to be really shitty code but functional. it isnt fast. it isnt safe
// but it makes my library the only implementation on the planet of streaming openai on bun in june 2023
//
// we'll get real fetch streaming in the future so that this isnt needed and you can do
// (await fetch()).body.getReader()
//
// for now, lol

import { IterableStream } from '@paperdave/utils';
import { getAuthHeaders } from './api-key';
import { InternalFetchOptions } from './fetch';

type Socket = Awaited<ReturnType<typeof Bun.connect<POSTEventSource>>>;

class ProtocolError extends Error {}
Object.defineProperty(ProtocolError.prototype, 'name', { value: 'ProtocolError' });

class POSTEventSource extends EventTarget {
  #url;
  #state;
  #onerror;
  #onmessage;
  #onopen;
  #is_tls = false;
  #socket: Socket | null = null;
  #data_buffer = '';
  #send_buffer = '';
  #send_buffer2: Uint8Array | null = null;
  #lastEventID = '';
  #reconnect = true;
  #content_length = 0; // 0 means chunked -1 means not informed aka no auto end
  #received_length = 0;
  #reconnection_time = 0;
  #reconnection_timer: Timer | null = null;
  #options2: any;

  datastream = new IterableStream();

  static #ConnectNextTick(self: POSTEventSource) {
    self.#connect();
  }
  static #SendRequest(socket: Socket, url: URL) {
    const self = socket.data;
    const buffer = self.#options2?.body;
    const headers = self.#options2?.headers;
    const last_event_header = headers
      ? headers.map((h: any) => `\r\n${h.name}: ${h.value}`).join('')
      : '';

    const request = `POST ${url.pathname}${url.search} HTTP/1.1\r\nHost: ${
      url.host
    }\r\nUser-Agent: ${
      navigator.userAgent
    }\r\nConnection: Close\r\nContent-Type: application/json\r\nContent-Length: ${
      buffer.byteLength - 1
    }${last_event_header}\r\n\r\n${new TextDecoder().decode(buffer)}`;
    const sended = socket.write(request);
    if (sended !== request.length) {
      self.#send_buffer = request.substring(sended);
    }
  }

  static #ProcessChunk(self: POSTEventSource, chunks: string, offset: number) {
    const part = chunks.substring(offset).replace(/^\r\n/g, '');
    self.datastream.push(part);
  }
  static #Handlers = {
    open(socket: Socket) {
      const self = socket.data;
      socket.timeout(999_999_999);
      self.#socket = socket;
      if (!self.#is_tls) {
        POSTEventSource.#SendRequest(socket, self.#url);
      }
    },
    handshake(socket: Socket, success: boolean, verifyError: Error) {
      const self = socket.data;
      if (success) {
        POSTEventSource.#SendRequest(socket, self.#url);
      } else {
        self.#state = 2;
        self.dispatchEvent(new ErrorEvent('error', { error: verifyError }));
        socket.end();
      }
    },
    data(socket: Socket, buffer: Buffer) {
      const self = socket.data;
      switch (self.#state) {
        case 0: {
          let text = buffer.toString();

          const headers_idx = text.indexOf('\r\n\r\n');
          if (headers_idx === -1) {
            // wait headers
            self.#data_buffer += text;
            return;
          }

          if (self.#data_buffer.length) {
            self.#data_buffer += text;
            text = self.#data_buffer;
            self.#data_buffer = '';
          }
          const headers = text.substring(0, headers_idx);
          const status_idx = headers.indexOf('\r\n');

          if (status_idx === -1) {
            self.#state = 2;
            self.dispatchEvent(
              new ErrorEvent('error', { error: new ProtocolError('Invalid HTTP request') })
            );
            socket.end();
            return;
          }
          const status = headers.substring(0, status_idx);
          if (status !== 'HTTP/1.1 200 OK') {
            self.#state = 2;
            self.dispatchEvent(
              new ErrorEvent('error', {
                error: new ProtocolError('Unexpected status line\n' + JSON.stringify(headers)),
              })
            );
            socket.end();
            return;
          }

          let start_idx = status_idx + 1;
          let mime_type_ok = false;
          let content_length = -1;
          for (;;) {
            let header_idx = headers.indexOf('\r\n', start_idx);
            // No text/event-stream mime type
            if (header_idx === -1) {
              if (start_idx >= headers.length) {
                if (!mime_type_ok) {
                  self.#state = 2;
                  self.dispatchEvent(
                    new ErrorEvent('error', {
                      error: new ProtocolError(
                        `EventSource HTTP response must have \"Content-Type\" header set to "text/event-stream". Aborting the connection.`
                      ),
                    })
                  );
                  socket.end();
                }
                return;
              }

              header_idx = headers.length;
            }

            const header = headers.substring(start_idx + 1, header_idx);
            const header_name_idx = header.indexOf(':');
            const header_name = header.substring(0, header_name_idx);
            const is_content_type =
              header_name.localeCompare('content-type', undefined, { sensitivity: 'accent' }) === 0;
            start_idx = header_idx + 1;

            if (is_content_type) {
              if (header.endsWith(' text/event-stream')) {
                mime_type_ok = true;
              } else {
                // wrong mime type
                self.#state = 2;
                self.dispatchEvent(
                  new ErrorEvent('error', {
                    error: new ProtocolError(
                      `EventSource HTTP response must have \"Content-Type\" header set to "text/event-stream". Aborting the connection.`
                    ),
                  })
                );
                socket.end();
                return;
              }
            } else {
              const is_content_length =
                header_name.localeCompare('content-length', undefined, {
                  sensitivity: 'accent',
                }) === 0;
              if (is_content_length) {
                content_length = parseInt(header.substring(header_name_idx + 1).trim(), 10);
                if (isNaN(content_length) || content_length <= 0) {
                  self.dispatchEvent(
                    new ErrorEvent('error', {
                      error: new Error(
                        `EventSource's Content-Length is invalid. Aborting the connection.`
                      ),
                    })
                  );
                  socket.end();
                  return;
                }
                if (mime_type_ok) {
                  break;
                }
              } else {
                const is_transfer_encoding =
                  header_name.localeCompare('transfer-encoding', undefined, {
                    sensitivity: 'accent',
                  }) === 0;
                if (is_transfer_encoding) {
                  if (header.substring(header_name_idx + 1).trim() !== 'chunked') {
                    self.dispatchEvent(
                      new ErrorEvent('error', {
                        error: new ProtocolError(
                          `EventSource's Transfer-Encoding is invalid. Aborting the connection.`
                        ),
                      })
                    );
                    socket.end();
                    return;
                  }
                  content_length = 0;
                  if (mime_type_ok) {
                    break;
                  }
                }
              }
            }
          }

          self.#content_length = content_length;
          self.#state = 1;
          self.dispatchEvent(new Event('open'));
          const chunks = text.substring(headers_idx + 4);
          POSTEventSource.#ProcessChunk(self, chunks, 0);
          if (self.#content_length > 0) {
            self.#received_length += chunks.length;
            if (self.#received_length >= self.#content_length) {
              self.#state = 2;
              socket.end();
            }
          }
          return;
        }
        case 1:
          POSTEventSource.#ProcessChunk(self, buffer.toString(), 2);
          if (self.#content_length > 0) {
            self.#received_length += buffer.byteLength;
            if (self.#received_length >= self.#content_length) {
              self.#state = 2;
              socket.end();
            }
          }
          return;
        default:
          break;
      }
    },
    drain(socket: Socket) {
      const self = socket.data;
      if (self.#state === 0) {
        const request = self.#data_buffer;
        if (request.length) {
          const sended = socket.write(request);
          if (sended !== request.length) {
            socket.data.#send_buffer = request.substring(sended);
          } else {
            socket.data.#send_buffer = '';
          }
        }
      }
    },
    close: POSTEventSource.#Close,
    end(socket: Socket) {
      POSTEventSource.#Close(socket).dispatchEvent(
        new ErrorEvent('error', { error: new Error('Connection closed by server') })
      );
    },
    timeout(socket: Socket) {
      POSTEventSource.#Close(socket).dispatchEvent(
        new ErrorEvent('error', { error: new Error('Timeout') })
      );
    },
    binaryType: 'buffer',
  };

  static #Close(socket: Socket) {
    const self = socket.data;
    self.#socket = null;
    self.#received_length = 0;
    self.#state = 2;
    if (self.#reconnect) {
      if (self.#reconnection_timer) {
        clearTimeout(self.#reconnection_timer);
      }
      self.#reconnection_timer = setTimeout(
        POSTEventSource.#ConnectNextTick,
        self.#reconnection_time,
        self
      );
    }
    return self;
  }
  constructor(url: string, options = undefined, options2 = undefined) {
    super();
    const uri = new URL(url);
    this.#is_tls = uri.protocol === 'https:';
    this.#url = uri;
    this.#state = 2;
    this.#options2 = options2;
    process.nextTick(POSTEventSource.#ConnectNextTick, this);
  }

  // Not web standard
  ref() {
    this.#reconnection_timer?.ref();
    this.#socket?.ref();
  }

  // Not web standard
  unref() {
    this.#reconnection_timer?.unref();
    this.#socket?.unref();
  }

  #connect() {
    if (this.#state !== 2) return;
    const uri = this.#url;
    const is_tls = this.#is_tls;
    this.#state = 0;
    //@ts-ignore
    Bun.connect({
      data: this,
      socket: POSTEventSource.#Handlers,
      hostname: uri.hostname,
      port: parseInt(uri.port || (is_tls ? '443' : '80'), 10),
      tls: is_tls
        ? {
            requestCert: true,
            rejectUnauthorized: false,
          }
        : false,
    }).catch(err => {
      this.dispatchEvent(new ErrorEvent('error', { error: err }));
      if (this.#reconnect) {
        if (this.#reconnection_timer) {
          this.#reconnection_timer.unref?.();
        }

        this.#reconnection_timer = setTimeout(POSTEventSource.#ConnectNextTick, 1000, this);
      }
    });
  }

  get url() {
    return this.#url.href;
  }

  get readyState() {
    return this.#state;
  }

  close() {
    this.#reconnect = false;
    this.#state = 2;
    this.#socket?.unref();
    this.#socket?.end();
    this.datastream.end();
  }

  get onopen() {
    return this.#onopen;
  }
  get onerror() {
    return this.#onerror;
  }
  get onmessage() {
    return this.#onmessage;
  }

  set onopen(cb) {
    if (this.#onopen) {
      super.removeEventListener('close', this.#onopen);
    }
    super.addEventListener('open', cb);
    this.#onopen = cb;
  }

  set onerror(cb) {
    if (this.#onerror) {
      super.removeEventListener('error', this.#onerror);
    }
    super.addEventListener('error', cb);
    this.#onerror = cb;
  }

  set onmessage(cb) {
    if (this.#onmessage) {
      super.removeEventListener('message', this.#onmessage);
    }
    super.addEventListener('message', cb);
    this.#onmessage = cb;
  }
}

Object.defineProperty(POSTEventSource.prototype, 'CONNECTING', {
  enumerable: true,
  value: 0,
});

Object.defineProperty(POSTEventSource.prototype, 'OPEN', {
  enumerable: true,
  value: 1,
});

Object.defineProperty(POSTEventSource.prototype, 'CLOSED', {
  enumerable: true,
  value: 2,
});

const base = 'https://api.openai.com/v1';

export async function fetchOpenAI_BunEventSource(
  options: InternalFetchOptions
): Promise<ReadableStreamDefaultReader> {
  const { endpoint, method, body, init, retry = 3, auth } = options;

  if (method !== 'POST') throw new Error('TODO');

  const request = new POSTEventSource(base + endpoint, undefined, {
    body: new TextEncoder().encode(JSON.stringify(body) + '\n'),
    headers: Object.entries(getAuthHeaders(auth)).map(([name, value]) => ({ name, value })),
  } as any);

  return {
    read() {
      return request.datastream.next();
    },
    releaseLock() {
      //
    },
    _destroy() {
      request.close();
    },
  } as any;
}
