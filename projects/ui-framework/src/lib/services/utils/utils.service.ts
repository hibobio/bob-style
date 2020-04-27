import { Injectable } from '@angular/core';
import { fromEvent, Observable, merge, Observer } from 'rxjs';
import {
  map,
  share,
  throttleTime,
  startWith,
  distinctUntilChanged,
  flatMap,
  delay,
} from 'rxjs/operators';
import { WindowRef } from './window-ref.service';
import { ScrollEvent } from './utils.interface';
import { DOMhelpers } from '../html/dom-helpers.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  winResize$: Observable<any>;
  winScroll$: Observable<ScrollEvent>;
  winClick$: Observable<MouseEvent>;
  winKey$: Observable<KeyboardEvent>;

  constructor(private windowRef: WindowRef) {
    this.winResize$ = fromEvent(
      this.windowRef.nativeWindow as Window,
      'resize'
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
      'scroll'
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

  public getElementInViewEvent(element: HTMLElement): Observable<boolean> {
    if (
      !('IntersectionObserver' in this.windowRef.nativeWindow) ||
      !('IntersectionObserverEntry' in this.windowRef.nativeWindow) ||
      !(
        'intersectionRatio' in
        (this.windowRef.nativeWindow as any).IntersectionObserverEntry.prototype
      )
    ) {
      return merge(this.winScroll$, this.winResize$).pipe(
        startWith(1),
        throttleTime(300, undefined, {
          leading: true,
          trailing: true,
        }),
        map(() => DOMhelpers.prototype.isInView(element)),
        distinctUntilChanged()
      );
    }

    return new Observable((observer: Observer<IntersectionObserverEntry[]>) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        observer.next(entries);
      });
      intersectionObserver.observe(element);

      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      flatMap((entries: IntersectionObserverEntry[]) => entries),
      map((entry: IntersectionObserverEntry) => entry.isIntersecting),
      distinctUntilChanged(),
      delay(100)
    );
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
      element.getBoundingClientRect().top +
      this.windowRef.nativeWindow.scrollY +
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
