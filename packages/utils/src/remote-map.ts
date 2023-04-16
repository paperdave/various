/**
 * RemoteMap is an interface to any form of async KeyValue store. Intentionally made extremely
 * minimal for easy implementation.
 */
export interface IAnyRemoteMap<K, V> {
  get(key: K): Promise<V | undefined>;
  set(key: K, value: V): Promise<void>;
  delete(key: K): Promise<boolean>;
}

/**
 * RemoteMap is an interface to any form of async KeyValue store. Intentionally made extremely
 * minimal for easy implementation.
 */
export type IRemoteMap<V> = IAnyRemoteMap<string, V>;

export class InMemoryRemoteMap implements IRemoteMap<any> {
  private readonly map = new Map<string, any>();

  async get(key: string): Promise<any> {
    return this.map.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    this.map.set(key, value);
  }

  async delete(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
}
