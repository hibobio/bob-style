import { BehaviorSubject, Observable, Operator } from 'rxjs';
import { pass } from './functional-utils';

/*
  Inspiration:
  https://github.com/Futhark/ngx-observable-input
  https://github.com/insidewhy/observable-input

  Example:
  @InputSubject('Untitled') @Input('title') public title$: BehaviorSubject<string>;
*/
export function InputSubject<T = any>(
  defaultValue: T = undefined,
  operators: Operator<any, T>[] = [pass]
) {
  const subjectSymbol = Symbol();

  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      set: function (value: T) {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject<T>(defaultValue);
        }
        if (value !== undefined && value !== this[subjectSymbol].getValue()) {
          this[subjectSymbol].next(value);
        }
      },
      get: function (): BehaviorSubject<T> {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject<T>(defaultValue);
        }
        return this[subjectSymbol].pipe(...operators) as BehaviorSubject<T>;
      },
    });
  };
}

/*
  Inspiration:
  https://github.com/Futhark/ngx-observable-input
  https://github.com/insidewhy/observable-input

  Example:
  @InputObservable('Untitled') @Input('title') public title$: Observable<string>;
*/
export function InputObservable<T = any>(
  defaultValue: T = undefined,
  operators: Operator<any, T>[] = [pass]
) {
  const subjectSymbol = Symbol();
  const subjectSymbolObservable = Symbol();

  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      set: function (value: T) {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject<T>(defaultValue);
          this[subjectSymbolObservable] = this[subjectSymbol].asObservable();
        }
        if (value !== undefined && value !== this[subjectSymbol].getValue()) {
          this[subjectSymbol].next(value);
        }
      },
      get: function (): Observable<T> {
        if (!this[subjectSymbol]) {
          this[subjectSymbol] = new BehaviorSubject<T>(defaultValue);
          this[subjectSymbolObservable] = this[subjectSymbol].asObservable();
        }
        return this[subjectSymbolObservable].pipe(...operators);
      },
    });
  };
}
