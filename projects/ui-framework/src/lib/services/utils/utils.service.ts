import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, share, tap, throttleTime } from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent, WinResizeEvent } from './utils.interface';
import { insideZone } from './rxjs.operators';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  winResize$: Observable<WinResizeEvent>;
  winScroll$: Observable<ScrollEvent>;
  winClick$: Observable<MouseEvent>;
  winKey$: Observable<KeyboardEvent>;

  constructor(private windowRef: WindowRef, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      this.winResize$ = fromEvent<UIEvent>(
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
        map((e: UIEvent) => e.target as Window),
        share()
      );

      this.winScroll$ = fromEvent(
        this.windowRef.nativeWindow as Window,
        'scroll',
        {
          passive: true,
        }
      ).pipe(
        map(
          (e: Event) => (e.currentTarget || document.scrollingElement) as Window
        ),
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
    });
  }

  public getResizeEvent(outsideNgZone = false): Observable<WinResizeEvent> {
    return outsideNgZone
      ? this.winResize$
      : this.winResize$.pipe(insideZone(this.zone));
  }

  public getScrollEvent(outsideNgZone = false): Observable<ScrollEvent> {
    return outsideNgZone
      ? this.winScroll$
      : this.winScroll$.pipe(insideZone(this.zone));
  }

  public getWindowClickEvent(outsideNgZone = false): Observable<MouseEvent> {
    return outsideNgZone
      ? this.winClick$
      : this.winClick$.pipe(insideZone(this.zone));
  }

  public getWindowKeydownEvent(
    outsideNgZone = false
  ): Observable<KeyboardEvent> {
    return outsideNgZone
      ? this.winKey$
      : this.winKey$.pipe(insideZone(this.zone));
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
