import { NgZone } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Source: https://netbasal.com/optimizing-angular-change-detection-triggered-by-dom-events-d2a3b2e11d87

export function outsideZone<T>(zone: NgZone) {
  return function (source: Observable<T>) {
    return new Observable<T>((observer) => {
      let sub: Subscription;
      zone.runOutsideAngular(() => {
        sub = source.subscribe(observer);
      });

      return sub;
    });
  };
}

export function insideZone<T>(zone: NgZone) {
  return function (source: Observable<T>) {
    return new Observable<T>((observer) => {
      let sub: Subscription;
      zone.run(() => {
        sub = source.subscribe(observer);
      });

      return sub;
    });
  };
}

export function counter() {
  return function <T>(source: Observable<T>): Observable<number> {
    let i = 0;
    return source.pipe(map(() => ++i));
  };
}
