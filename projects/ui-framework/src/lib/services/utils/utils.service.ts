import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, share, throttleTime } from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent } from './utils.interface';

export interface WinResizeEvent {
  innerWidth: number;
  innerHeight: number;
  outerHeight: number;
  outerWidth: number;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  winResize$: Observable<WinResizeEvent>;
  winScroll$: Observable<ScrollEvent>;
  winClick$: Observable<MouseEvent>;
  winKey$: Observable<KeyboardEvent>;

  constructor(private windowRef: WindowRef) {
    this.winResize$ = fromEvent(
      this.windowRef.nativeWindow as Window,
      'resize',
      {
        passive: true,
      }
    ).pipe(
      throttleTime(500, undefined, {
        leading: true,
        trailing: true,
      }),
      map((e: Event) => ({
        innerWidth: e.target['innerWidth'],
        innerHeight: e.target['innerHeight'],
        outerHeight: e.target['outerHeight'],
        outerWidth: e.target['outerWidth'],
      })),
      share()
    );

    this.winScroll$ = fromEvent(
      this.windowRef.nativeWindow as Window,
      'scroll',
      {
        passive: true,
      }
    ).pipe(
      map((e: Event) => ({
        scrollY: (
          (e.currentTarget as any) || (document.scrollingElement as any)
        ).scrollY,
        scrollX: (
          (e.currentTarget as any) || (document.scrollingElement as any)
        ).scrollX,
      })),
      share()
    );

    this.winClick$ = fromEvent(
      this.windowRef.nativeWindow as Window,
      'click'
    ).pipe(share()) as Observable<MouseEvent>;

    this.winKey$ = fromEvent(
      this.windowRef.nativeWindow as Window,
      'keydown'
    ).pipe(share()) as Observable<KeyboardEvent>;
  }

  public getResizeEvent(): Observable<WinResizeEvent> {
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

  public scrollToTop(offset = 0, smooth = false): void {
    this.windowScrollTo(offset, smooth);
  }

  public scrollToBottom(offset = 0, smooth = false): void {
    const scrollToTop =
      this.windowRef.nativeWindow.document.body.scrollHeight - offset;

    this.windowScrollTo(scrollToTop, smooth);
  }

  public scrollToElement(
    element: HTMLElement,
    offset = 0,
    smooth = false
  ): void {
    const scrollToTop =
      this.windowRef.nativeWindow.scrollY +
      element.getBoundingClientRect().top +
      offset;
    this.windowScrollTo(scrollToTop, smooth);
  }

  public windowScrollTo(scrollToTop = 0, smooth = false) {
    if ('scrollBehavior' in document.documentElement.style) {
      this.windowRef.nativeWindow.scrollTo({
        left: 0,
        top: scrollToTop,
        behavior: smooth ? 'smooth' : undefined,
      });
    } else {
      this.windowRef.nativeWindow.scrollTo(0, scrollToTop);
    }
  }
}
