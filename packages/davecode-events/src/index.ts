export type BaseEventMap = Record<string, any> | {};
export type EventHandler<T> = undefined | never extends T
  ? (event: never) => void
  : (event: T) => void;

type UndefinedKeys<T> = {} extends T
  ? string
  : { [K in keyof T]: undefined | never extends T[K] ? K : never }[keyof T];
type DefinedKeys<T> = {} extends T
  ? string
  : { [K in keyof T]: undefined | never extends T[K] ? never : K }[keyof T];
type AllKeys<T> = {} extends T ? string : keyof T;

// @ts-ignore
type Key<T, K extends PropertyKey> = T[K];

/**
 * A generic typed event-emitter class. Only supports singular argument events. Pass an interface
 * mapping event names to their event value.
 */
export class Emitter<T extends BaseEventMap = {}> {
  #listeners: Partial<Record<AllKeys<T>, Set<EventHandler<any>>>> = {};

  /** Adds an event listener. Returns a function that can be called to remove the listener. */
  on<K extends AllKeys<T>>(event: K, listener: EventHandler<Key<T, K>>) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = new Set();
    }
    this.#listeners[event]!.add(listener);
    return () => this.off(event, listener);
  }

  /** Removes an event listener by given event name and listener function. */
  off<K extends AllKeys<T>>(event: K, listener: EventHandler<Key<T, K>>) {
    this.#listeners[event]?.delete(listener);
  }

  /** Emits an event. */
  emit<K extends UndefinedKeys<T>>(event: K): void;
  emit<K extends DefinedKeys<T>>(event: K, data: Key<T, K>): void;
  emit<K extends keyof T>(event: K, data?: T[K]): void {
    this.#listeners[event]?.forEach(listener => (listener as any)(data));
  }

  /** Removes all listeners for an event or all if no event is provided. */
  removeAllListeners(event?: AllKeys<T>) {
    if (event) {
      this.#listeners[event]?.clear();
    } else {
      this.#listeners = {};
    }
  }

  // DOM Compatibility

  /** Adds an event listener. Returns a function that can be called to remove the listener. Identical to `.on` */
  addEventListener<K extends AllKeys<T>>(event: K, listener: EventHandler<Key<T, K>>) {
    return this.on(event, listener);
  }

  /** Removes an event listener by given event name and listener function. Identical to `.off` */
  removeEventListener<K extends AllKeys<T>>(event: K, listener: EventHandler<Key<T, K>>) {
    return this.off(event, listener);
  }
}
