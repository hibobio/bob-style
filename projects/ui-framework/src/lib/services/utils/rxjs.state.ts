import { BehaviorSubject } from 'rxjs';

import { cloneDeepSimpleObject } from './functional-utils';

/**
 * @extends BehaviorSubject
 *
 * A subject that is meant to be used as 'State' object with easy access
 * to setting and getting of separate properties.
 *
 * It's similar to `BehaviouSubject`, but can be next'ed or subscribed
 * to partials of the value.
 *
 * Additional methods:
 * - `get(key)` - returns single property value and;
 * - `set(key, value)` - sets single property of value;
 * - `reset()` - will reset to the 'init' value the subject
 * was initialized with
 *
 * @example
 * ```ts
 * state = new StateSubject({ boo: 1, hoo: 'up' });
 * state.next({why: 2}); // { boo: 2, hoo: 'up' }
 * state.set('why', 3); // { boo: 3, hoo: 'up' }
 * of({why:4}).subscribe(state) // { boo: 4, hoo: 'up' }
 * state.get('why'); // 4;
 * state.reset();
 * state.getValue(); // { boo: 1, hoo: 'up' };
 * ```
 *
 * .
 */
export class StateSubject<S extends object> extends BehaviorSubject<S> {
  constructor(initValue: S) {
    super(initValue);
    this._i = Object.freeze(cloneDeepSimpleObject(initValue));
  }

  private readonly _i: Readonly<S>;

  next(value: Partial<S>): void {
    super.next({
      ...this.value,
      ...value,
    });
  }

  get<K extends keyof S>(key: K): S[K] {
    return this.value[key];
  }

  set<K extends keyof S>(key: K, value: S[K]): void {
    super.next({
      ...this.value,
      [key]: value,
    });
  }

  reset(): void {
    super.next({
      ...this.value,
      ...this._i,
    });
  }
}
