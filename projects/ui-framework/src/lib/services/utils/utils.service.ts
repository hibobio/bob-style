import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent } from './utils.interface';

@Injectable()
export class UtilsService {
  constructor(
    public windowRef: WindowRef,
  ) {
  }

  public getResizeEvent(): Observable<any> {
    return fromEvent(this.windowRef.nativeWindow, 'resize')
      .pipe(
        debounceTime(500)
      );
  }

  public getScrollEvent(): Observable<ScrollEvent> {
    return fromEvent(this.windowRef.nativeWindow, 'scroll')
      .pipe(
        map((e: Event) => ({
          scrollY: (e.currentTarget as Window).scrollY,
          scrollX: (e.currentTarget as Window).scrollX,
        }))
      );
  }
}
