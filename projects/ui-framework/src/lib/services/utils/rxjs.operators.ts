import { NgZone } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

// Source: https://netbasal.com/optimizing-angular-change-detection-triggered-by-dom-events-d2a3b2e11d87

export function outsideZone<T>(zone: NgZone) {
  return function(source: Observable<T>) {
    return new Observable(observer => {
      let sub: Subscription;
      zone.runOutsideAngular(() => {
        sub = source.subscribe(observer);
      });

      return sub;
    });
  };
}
