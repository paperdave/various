import { Timer } from './types';

export interface CacheMapOptions {
  /** How long to keep the values in the map for. In Seconds. */
  ttl?: number;

  /** How often to check for expired values. In Seconds. */
  checkInterval?: number;
}
interface CacheMapEntry<V> {
  value: V;
  expires: number;
}

let supportsIntervalUnref = false;

/** Map that clears it's own values out after x amount of time. */
export class CacheMap<K, V> implements Map<K, V> {
  #map = new Map<K, CacheMapEntry<V>>();
  #ttl = 60;
  #checkInterval = 500;
  #lastCheck = Date.now();
  #interval: Timer | undefined;

  constructor(opts: CacheMapOptions = {}) {
    if (opts.ttl) this.#ttl = opts.ttl;
    if (opts.checkInterval) this.#checkInterval = opts.checkInterval;
  }

  #startTimer() {
    if (this.#interval || !supportsIntervalUnref) return;
    this.#interval = setInterval(() => {
      this.sweep();
    }, this.#checkInterval * 1000);
    if (this.#interval.unref) this.#interval.unref();
    else {
      supportsIntervalUnref = false;
      clearInterval(this.#interval);
    }
  }

  #stopTimer() {
    if (!this.#interval) return;
    clearInterval(this.#interval);
    this.#interval = undefined;
  }

  sweep() {
    const now = Date.now();
    if (now - this.#lastCheck < this.#checkInterval * 1000) return;
    this.#lastCheck = now;
    const expires = now - this.#ttl * 1000;
    for (const [key, entry] of this.#map) {
      if (entry.expires < expires) {
        this.delete(key);
      }
    }
  }

  clear(): void {
    this.#map.clear();
  }
  delete(key: K): boolean {
    if (this.#map.delete(key)) {
      if (this.#map.size === 0) {
        this.#stopTimer();
      }
      return true;
    }
    return false;
  }
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    this.#map.forEach((value, key) => callbackfn(value.value, key, this), thisArg);
  }
  get(key: K): V | undefined {
    const entry = this.#map.get(key);
    if (entry) {
      if (entry.expires < Date.now()) {
        this.delete(key);
        return undefined;
      }
      return entry.value;
    }
    return undefined;
  }
  has(key: K): boolean {
    const entry = this.#map.get(key);
    if (entry) {
      const now = Date.now();
      if (entry.expires < now) {
        this.delete(key);
        return false;
      }
      // If within one second of cleanup, extend the expiration just in case someone assumes it's still there.
      if (entry.expires - now < 1000) {
        entry.expires = now + 2000;
      }
      return true;
    }
    return false;
  }
  set(key: K, value: V): this {
    this.#map.set(key, {
      value,
      expires: Date.now() + this.#ttl * 1000,
    });
    if (this.#map.size === 1) {
      this.#startTimer();
    }
    return this;
  }
  get size() {
    return this.#map.size;
  }
  *entries(): IterableIterator<[K, V]> {
    for (const [key, entry] of this.#map) {
      if (entry.expires < Date.now()) {
        this.delete(key);
      } else {
        yield [key, entry.value];
      }
    }
  }
  *keys(): IterableIterator<K> {
    for (const [key, entry] of this.#map) {
      if (entry.expires < Date.now()) {
        this.delete(key);
      } else {
        yield key;
      }
    }
  }
  *values(): IterableIterator<V> {
    for (const [key, entry] of this.#map) {
      if (entry.expires < Date.now()) {
        this.delete(key);
      } else {
        yield entry.value;
      }
    }
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
  [Symbol.toStringTag] = 'CacheMap';
}
