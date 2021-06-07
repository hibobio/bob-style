import { format } from 'date-fns';
import { interval, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { NgZone, ɵɵdirectiveInject as directiveInject } from '@angular/core';

import { insideZone } from './rxjs.operators';

/**
 * Return an observable that can be used to display current time (without seconds)
 * @param timeFormat usually 'HH:mm' for 24h clock and 'h:mm a' for 12h with am/pm
 * @param zone pass NgZone instance
 * @returns an array of strings representing current time in format [hours, minutes, amPm]
 * ```ts
 * this.time$ = clock$('h:m a');
 * ```
 * ```html
 * <ng-container *ngLet="(time$|async)||[] as t">
 *  {{ t[0] }} : {{ t[1] }} {{ t[2] }}
 * </ng-container>
 * ```
 *
 * .
 */
export const clock$ = (
  timeFormat:
    | 'HH:mm'
    | 'hh:mm'
    | 'h:mm'
    | 'h:m'
    | 'hh:mm a'
    | 'h:mm a'
    | 'h:m a' = 'HH:mm',
  zone?: NgZone
): Observable<[hours: string, minutes: string, amPm: string]> => {
  try {
    zone = zone || directiveInject(NgZone);
  } catch (e) {
    zone = {
      runOutsideAngular: (fnc) => fnc(),
      run: (fnc) => fnc(),
    } as NgZone;
  }

  let clockObs: Observable<[string, string, string]>;

  zone.runOutsideAngular(() => {
    clockObs = interval(333).pipe(
      startWith(1),
      map((): [Date, number, number] => {
        const date = new Date();
        return [date, date.getHours(), date.getMinutes()];
      }),
      distinctUntilChanged((prev, curr) => {
        return prev[1] === curr[1] && prev[2] === curr[2];
      }),
      map(([date]): [string, string, string] => {
        return format(date, timeFormat).split(/\W/).slice(0, 3) as any;
      }),
      insideZone(zone)
    );
  });
  return clockObs;
};
