import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map, share, shareReplay } from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent } from './utils.interface';

@Injectable()
export class UtilsService {
  winResize$: Observable<any>;
  winScroll$: Observable<ScrollEvent>;
  winClick$: Observable<MouseEvent>;
  winKey$: Observable<KeyboardEvent>;

  constructor(public windowRef: WindowRef) {
    this.winResize$ = fromEvent(this.windowRef.nativeWindow, 'resize').pipe(
      debounceTime(500),
      shareReplay()
    );
    this.winScroll$ = fromEvent(this.windowRef.nativeWindow, 'scroll').pipe(
      debounceTime(100),
      map((e: Event) => ({
        scrollY: (e.currentTarget as Window).scrollY,
        scrollX: (e.currentTarget as Window).scrollX
      })),
      shareReplay()
    );
    this.winClick$ = fromEvent(this.windowRef.nativeWindow, 'click');
    this.winKey$ = fromEvent(this.windowRef.nativeWindow, 'keydown');
  }

  public getResizeEvent(): Observable<any> {
    return this.winResize$;
  }

  public getScrollEvent(): Observable<ScrollEvent> {
    return this.winScroll$;
  }

  public getWindowClickEvent(): Observable<MouseEvent> {
    return this.winClick$;
  }

  public getWindowKeydownEvent(): Observable<KeyboardEvent> {
    return this.winKey$;
  }
}
