import { ɵɵdirectiveInject as directiveInject } from '@angular/core';
import { NgZone } from '@angular/core';
import { isMap, mapSplice } from './functional-utils';

export interface SimpleCacheConfig<V = unknown, K = unknown> {
  map?: Map<K, V>;
  capacity?: number;
  TTL?: number;
}

export class SimpleCache<V = unknown, K = string> {
  constructor({ map, capacity, TTL }: SimpleCacheConfig<V, K> = {}) {
    this._store = isMap(map) ? map : new Map();
    this._ttl = TTL === undefined ? 15 * 60000 : TTL;
    this._cap = capacity === undefined ? 30 : capacity;
    this._zone = directiveInject(NgZone);
  }
  private readonly _store: SimpleCacheConfig<V, K>['map'];
  private readonly _ttl: SimpleCacheConfig<V, K>['TTL'];
  private readonly _cap: SimpleCacheConfig<V, K>['capacity'];
  private readonly _zone: NgZone;
  private readonly _timers: Map<K, NodeJS.Timer | number> = new Map();

  public put(key: K, value: V): number {
    this._store.set(key, value);
    this.setTTLtimer(key);
    return this.checkCacheSize();
  }

  public get(key: K): V {
    this.setTTLtimer(key);
    return this._store.get(key);
  }

  public del(key: K): void {
    this.clearTimer(key);
    this._store.delete(key);
  }

  public has(key: K): boolean {
    return this._store.has(key);
  }

  public clear(): void {
    this._timers.forEach((timer, key: K) => this.clearTimer(key));
    this._timers.clear();
    this._store.clear();
  }

  public forEach(fn: (v: V, k: K) => void): void {
    this._store.forEach(fn);
  }

  public get map(): SimpleCacheConfig<V, K>['map'] {
    return this._store;
  }

  public get entries(): [K, V][] {
    return Array.from(this._store.entries());
  }

  public get values(): V[] {
    return Array.from(this._store.values());
  }

  public get keys(): K[] {
    return Array.from(this._store.keys());
  }

  public get size(): number {
    return this._store.size;
  }

  private setTTLtimer(key: K, time: number = this._ttl) {
    if (!this._ttl) {
      return;
    }
    this.clearTimer(key);

    this._zone.runOutsideAngular(() => {
      this._timers.set(
        key,
        setTimeout(() => {
          this.del(key);
        }, time)
      );
    });
  }

  private clearTimer(key: K) {
    if (!this._ttl) {
      return;
    }
    if (this._timers.get(key)) {
      clearTimeout(this._timers.get(key) as any);
      this._timers.delete(key);
    }
  }

  private checkCacheSize(): number {
    const cacheSize = this._store.size;
    if (cacheSize > this._cap) {
      mapSplice<K, V>(this._store, 0, cacheSize - 10);
      return cacheSize - 10;
    }
    return cacheSize;
  }
}
