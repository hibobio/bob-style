import { defer, EMPTY, fromEvent, merge, Observable } from 'rxjs';
import { filter, map, share, throttleTime } from 'rxjs/operators';

import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';

import { DOMKeyboardEvent, DOMMouseEvent } from '../../types';
import { DocumentRef } from './document-ref.service';
import { asArray } from './functional-utils';
import { insideZone } from './rxjs.operators';
import {
  ScrollEvent,
  WindowMessageData,
  WinResizeEvent,
} from './utils.interface';
import { WindowRef } from './window-ref.service';

export function appScrollContainerTokenFactory() {
  return '.app-content > .content-wrapper';
}

export const APP_SCROLL_CONTAINER = new InjectionToken<string>(
  'App scrollable container selector',
  {
    factory: appScrollContainerTokenFactory,
  }
);

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  winResize$: Observable<WinResizeEvent>;
  winScroll$: Observable<ScrollEvent>;
  winClick$: Observable<DOMMouseEvent>;
  winKey$: Observable<DOMKeyboardEvent>;
  appScrollableContainerElement: HTMLElement;
  winMessages$: Observable<MessageEvent<WindowMessageData>['data']>;

  constructor(
    @Inject(APP_SCROLL_CONTAINER) private appScrollContainerSelector: string,
    private windowRef: WindowRef,
    private documentRef: DocumentRef,
    private zone: NgZone
  ) {
    //
    this.zone.runOutsideAngular(() => {
      //
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

      this.winScroll$ = merge(
        defer(() => {
          return this.appScrollableContainerElement ||
            (this.appScrollableContainerElement = this.documentRef.nativeDocument.querySelector(
              this.appScrollContainerSelector
            ))
            ? fromEvent(this.appScrollableContainerElement, 'scroll', {
                passive: true,
              })
            : EMPTY;
        }),

        fromEvent(this.windowRef.nativeWindow as Window, 'scroll', {
          passive: true,
        })
      ).pipe(
        map((e: Event) => {
          const target =
            (e.currentTarget as any) || (document.scrollingElement as any);

          return {
            scrollY: target.scrollY || target.scrollTop,
            scrollX: target.scrollX || target.scrollLeft,
          };
        }),

        share()
      );

      this.winClick$ = fromEvent<DOMMouseEvent>(
        this.windowRef.nativeWindow as Window,
        'click'
      ).pipe(share());

      this.winKey$ = fromEvent<DOMKeyboardEvent>(
        this.windowRef.nativeWindow as Window,
        'keydown'
      ).pipe(share());
    });

    this.winMessages$ = fromEvent<MessageEvent>(
      this.windowRef.nativeWindow as Window,
      'message'
    ).pipe(
      map((event) => event.data),
      share()
    );
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

  public getWindowClickEvent(outsideNgZone = false): Observable<DOMMouseEvent> {
    return outsideNgZone
      ? this.winClick$
      : this.winClick$.pipe(insideZone(this.zone));
  }

  public getWindowKeydownEvent(
    outsideNgZone = false
  ): Observable<DOMKeyboardEvent> {
    return outsideNgZone
      ? this.winKey$
      : this.winKey$.pipe(insideZone(this.zone));
  }

  public getWindowMessageEvents(
    filterBy: { id?: string | string[]; type?: string | string[] } = {}
  ): Observable<WindowMessageData> {
    return this.winMessages$.pipe(
      filter((eventData) => {
        return (
          (filterBy.id ? asArray(filterBy.id).includes(eventData.id) : true) &&
          (filterBy.type
            ? asArray(filterBy.type).includes(eventData.type)
            : true)
        );
      })
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
