import { Observable, ObservableInput, of, OperatorFunction } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import {
  isFalsyOrEmpty,
  isFunction,
  isMap,
  isNumber,
  isPlainObject,
  objectStringIDconfigured,
  stringify,
} from './functional-utils';
import { SimpleCache, SIMPLE_CACHE_TTL_DEF } from './simple-cache';

export interface CacheMapBaseConfig<T = unknown, R = T, K = unknown> {
  trackBy?: (value: T) => K;
  mapper: (value: T) => R | Observable<R>;
  dataCache?: Map<K, R | Observable<R>>;
  ignoreEmpty?: boolean;
  capacity?: number;
  TTL?: number;
  clearCacheOnUnsubscribe?: boolean;
}

export interface CacheMapConfig<T = unknown, R = T, K = unknown>
  extends CacheMapBaseConfig<T, R, K> {
  mapper: (value: T) => R;
  dataCache?: Map<K, R>;
}

const processCacheMapConfig = <T = unknown, R = T, K = unknown>(
  config: CacheMapConfig<T, R, K> | CacheMapConfig<T, R, K>['mapper'],
  defaultMapper: CacheMapConfig<T, R, K>['mapper'] = (v: T) =>
    (v as unknown) as R
): CacheMapConfig<T, R, K> => {
  const trackByFnc: CacheMapConfig<T, R, K>['trackBy'] = (isFunction(config) ||
  config?.trackBy === undefined
    ? objectStringIDconfigured<T>({
        limit: 5000,
        primitives: true,
        sort: false,
      })
    : isFunction(config?.trackBy)
    ? config.trackBy
    : JSON.stringify) as CacheMapConfig<T, R, K>['trackBy'];

  const mapperFnc: CacheMapConfig<T, R, K>['mapper'] = isFunction(config)
    ? config
    : isFunction(config.mapper)
    ? config.mapper
    : defaultMapper;

  return {
    ...(isPlainObject(config) ? config : {}),

    trackBy: (value: T): K => {
      let valueID: K;
      try {
        valueID = trackByFnc(value);
      } catch (e) {
        console.error(
          `[cacheMap]: calling trackBy on "${stringify(
            value
          )}" resulted in error`,
          e
        );
      }
      return valueID;
    },

    mapper: (value: T) => {
      let result: R;
      try {
        result = mapperFnc(value);
      } catch (e) {
        console.error(
          `[cacheMap]: trying to map "${stringify(value)}" resulted in error`,
          e
        );
      }
      return result;
    },

    TTL:
      !isFunction(config) && isMap(config?.dataCache) && !isNumber(config?.TTL)
        ? null
        : (config as CacheMapConfig<T, R, K>)?.TTL,

    clearCacheOnUnsubscribe:
      !isFunction(config) &&
      !isMap(config?.dataCache) &&
      config.clearCacheOnUnsubscribe !== false
        ? true
        : (config as CacheMapConfig<T, R, K>).clearCacheOnUnsubscribe || false,
  };
};

export const cacheMap = <T = unknown, R = T, K = string>(
  config: CacheMapConfig<T, R, K>['mapper'] | CacheMapConfig<T, R, K>
): OperatorFunction<T, R> => {
  //
  const {
    trackBy,
    mapper,
    dataCache,
    ignoreEmpty,
    capacity,
    TTL,
    clearCacheOnUnsubscribe,
  } = processCacheMapConfig(config);

  const cache = new SimpleCache<R, K>({
    map: dataCache,
    capacity,
    TTL,
  });

  let subsCount = 0;

  return (source: Observable<T>): Observable<R> => {
    return new Observable<R>((subscriber) => {
      ++subsCount;

      const subscription = source.subscribe({
        //
        next: (value: T) => {
          if (ignoreEmpty && isFalsyOrEmpty(value)) {
            return;
          }

          const valueID = trackBy(value);

          if (!cache.has(valueID)) {
            cache.put(valueID, mapper(value));
          }
          subscriber.next(cache.get(valueID));
        },

        complete() {
          cache.clearAllTimers();
          subscriber.complete();
        },

        error(error) {
          subscriber.error(error);
        },
      });

      return () => {
        --subsCount;

        if (subsCount < 1 && clearCacheOnUnsubscribe !== false) {
          if (TTL || TTL === undefined) {
            cache.clearAllTimers();
            cache.setTimer(
              'clear',
              () => cache.clear(),
              (TTL || SIMPLE_CACHE_TTL_DEF) / 3
            );
          } else {
            cache.clear();
          }
        }

        subscription.unsubscribe();
      };
    });
  };
};

export interface CacheSwitchMapConfig<T = unknown, R = T, K = unknown>
  extends CacheMapBaseConfig<T, R, K> {
  mapper: (value: T) => Observable<R>;
  dataCache?: Map<K, Observable<R>>;
}

export const cacheSwitchMap = <T = unknown, R = T, K = string>(
  config:
    | CacheSwitchMapConfig<T, R, K>['mapper']
    | CacheSwitchMapConfig<T, R, K>
): OperatorFunction<T, R> => {
  //
  const {
    trackBy,
    mapper,
    dataCache,
    ignoreEmpty,
    capacity,
    TTL,
    clearCacheOnUnsubscribe,
  } = processCacheMapConfig(config, (v: T) => of((v as unknown) as R));

  const cache = new SimpleCache<Observable<R>, K>({
    map: dataCache,
    capacity,
    TTL,
  });

  let subsCount = 0;

  return (source: Observable<T>): Observable<R> => {
    return new Observable<T>((subscriber) => {
      ++subsCount;

      const subscription = source.subscribe({
        //
        next: (value: T) => {
          if (ignoreEmpty && isFalsyOrEmpty(value)) {
            return;
          }

          subscriber.next(value);
        },

        complete() {
          cache.clearAllTimers();
          subscriber.complete();
        },

        error(error) {
          subscriber.error(error);
        },
      });

      return () => {
        --subsCount;

        if (subsCount < 1 && clearCacheOnUnsubscribe !== false) {
          if (TTL || TTL === undefined) {
            cache.clearAllTimers();
            cache.setTimer(
              'clear',
              () => cache.clear(),
              (TTL || SIMPLE_CACHE_TTL_DEF) / 3
            );
          } else {
            cache.clear();
          }
        }
        subscription.unsubscribe();
      };
    }).pipe(
      switchMap<T, ObservableInput<R>>((value: T) => {
        const valueID = trackBy(value);

        if (!cache.has(valueID)) {
          cache.put(valueID, mapper(value).pipe(shareReplay(1)));
        }
        return cache.get(valueID);
      })
    );
  };
};
