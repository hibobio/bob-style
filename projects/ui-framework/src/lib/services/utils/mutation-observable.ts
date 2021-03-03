import { Injectable } from '@angular/core';
import { merge, Observable, of, Subscriber } from 'rxjs';
import {
  WindowRef,
  WindowLike,
  ResizeObserverInstance,
  ResizeObserverEntry,
} from './window-ref.service';
import {
  getElementWindow,
  getType,
  isDomElement,
  isFunction,
  isNotEmptyString,
  pass,
} from './functional-utils';
import { DOMhelpers } from '../html/dom-helpers.service';
import { UtilsService } from './utils.service';
import {
  delay,
  distinctUntilChanged,
  map,
  startWith,
  throttleTime,
} from 'rxjs/operators';

export interface MutationObservableConfig extends MutationObserverInit {
  mutations?: 'original' | 'processed';
  filterSelector?: string;
  filterBy?: (node: Node) => boolean;
}

export interface ResizeObservableConfig {
  watch?: 'both' | 'width' | 'height';
  threshold?: number;
}

// tslint:disable-next-line: no-empty-interface
export interface IntersectionObservableConfig extends IntersectionObserverInit {
  delayEmit?: number;
}

export interface IntersectionObserverableEntry
  extends IntersectionObserverEntry {
  observer: IntersectionObserver;
  entries?: IntersectionObserverEntry[];
}

export const MUTATION_OBSERVABLE_CONFIG_DEF: MutationObservableConfig = {
  characterData: true,
  childList: true,
  subtree: true,
  attributeFilter: ['src', 'data-loaded', 'data-updated'],
  mutations: 'processed',
  filterBy: (node) => node?.nodeType === Node.ELEMENT_NODE,
};

export const RESIZE_OBSERVERVABLE_CONFIG_DEF: ResizeObservableConfig = {
  watch: 'both',
  threshold: 10,
};

export const INTERSECTION_OBSERVABLE_CONFIG_DEF: IntersectionObservableConfig = {};

export const ELEMENT_IN_VIEW_CONFIG_DEF: IntersectionObservableConfig = {
  ...INTERSECTION_OBSERVABLE_CONFIG_DEF,
  threshold: 0.8,
};

@Injectable({
  providedIn: 'root',
})
export class MutationObservableService {
  constructor(
    private windowRef: WindowRef,
    private DOM: DOMhelpers,
    private utilsService: UtilsService
  ) {
    this.nativeWindow = (this.windowRef.nativeWindow || window) as WindowLike;
  }

  private nativeWindow: WindowLike;

  public getMutationObservable(
    element: HTMLElement,
    config: MutationObservableConfig = MUTATION_OBSERVABLE_CONFIG_DEF,
    win: WindowLike = this.nativeWindow
  ): Observable<Set<HTMLElement>> {
    //
    win = win || (getElementWindow(element) as any);

    if (!isDomElement(element, win)) {
      console.error(
        `[MutationObservableService.getMutationObservable]: valid element to observe was not provided - got "${getType(
          element
        )}" instead`
      );
      return of(new Set());
    }

    return new Observable((subscriber: Subscriber<Set<HTMLElement>>) => {
      const mutationObserver: MutationObserver = new win.MutationObserver(
        (mutations: MutationRecord[]) => {
          if (config.mutations === 'original') {
            subscriber.next(mutations as any);
            return;
          }

          const affectedElementsSet = this.processMutations(
            mutations,
            element,
            config,
            win
          );

          if (affectedElementsSet.size) {
            subscriber.next(affectedElementsSet);
          }
        }
      );

      mutationObserver.observe(element, config);

      const unsubscribe = () => {
        mutationObserver.disconnect();
      };

      return unsubscribe;
    });
  }

  public getResizeObservervable(
    element: HTMLElement,
    config: ResizeObservableConfig = RESIZE_OBSERVERVABLE_CONFIG_DEF,
    win: WindowLike = this.nativeWindow
  ): Observable<Partial<DOMRectReadOnly>> {
    //
    win = win || (getElementWindow(element) as any);

    if (!isDomElement(element, win)) {
      console.error(
        `[MutationObservableService.getResizeObservervable]: valid element to observe was not provided - got "${getType(
          element
        )}" instead`
      );
      return of({ width: 0, height: 0 });
    }

    if (!win.ResizeObserver) {
      console.warn(
        `[MutationObservableService.getResizeObservervable] This browser doesn't support ResizeObserver`
      );
      return new Observable(
        (subscriber: Subscriber<Partial<DOMRectReadOnly>>) => {
          let lastRect: Partial<DOMRectReadOnly> = {
            width: 0,
            height: 0,
          };

          const resizeSub = this.utilsService.getResizeEvent().subscribe(() => {
            const newRect = {
              width: element.offsetWidth,
              height: element.offsetHeight,
            };

            if (this.compareDOMRects(lastRect, newRect, config)) {
              subscriber.next({ ...newRect });
              lastRect = newRect;
            }
          });

          const unsubscribe = () => {
            resizeSub.unsubscribe();
          };

          return unsubscribe;
        }
      );
    }

    return new Observable(
      (subscriber: Subscriber<Partial<DOMRectReadOnly>>) => {
        let lastRect: Partial<DOMRectReadOnly> = { width: 0, height: 0 };

        const resizeObserver: ResizeObserverInstance = new win.ResizeObserver(
          (entries: ResizeObserverEntry[]) => {
            const newRect = entries[entries.length - 1].contentRect;

            if (this.compareDOMRects(lastRect, newRect, config)) {
              subscriber.next(newRect);
              lastRect = newRect;
            }
          }
        );

        resizeObserver.observe(element);

        const unsubscribe = () => {
          resizeObserver.disconnect();
        };

        return unsubscribe;
      }
    );
  }

  public getIntersectionObservable(
    element: HTMLElement,
    config: IntersectionObservableConfig = INTERSECTION_OBSERVABLE_CONFIG_DEF,
    observer: IntersectionObserver = null,
    win: WindowLike = this.nativeWindow
  ): Observable<IntersectionObserverableEntry> {
    //
    win = win || (getElementWindow(element) as any);

    if (!isDomElement(element, win)) {
      console.error(
        `[MutationObservableService.getIntersectionObservable]: valid element to observe was not provided - got "${getType(
          element
        )}" instead`
      );
      return of({
        target: element,
        isIntersecting: false,
        isVisible: false,
      } as any);
    }

    if (
      !('IntersectionObserver' in win) ||
      !('IntersectionObserverEntry' in win) ||
      !('intersectionRatio' in win.IntersectionObserverEntry?.prototype)
    ) {
      console.warn(
        `[MutationObservableService.getIntersectionObservable] This browser doesn't support IntersectionObserver`
      );

      return merge(
        this.utilsService.getScrollEvent(),
        this.utilsService.getResizeEvent()
      ).pipe(
        startWith(1),
        throttleTime(300, undefined, {
          leading: true,
          trailing: true,
        }),
        map(() => this.DOM.isInView(element)),
        distinctUntilChanged(),
        map(
          (isInView) =>
            (({
              target: element,
              isIntersecting: isInView,
              isVisible: isInView,
            } as any) as IntersectionObserverableEntry)
        )
      );
    }

    return new Observable(
      (
        subscriber: Subscriber<
          IntersectionObserverableEntry | IntersectionObserverEntry[]
        >
      ) => {
        const intersectionObserver =
          observer ||
          new win.IntersectionObserver((entries) => {
            subscriber.next(entries);
          }, config);

        intersectionObserver.observe(element);

        const unsubscribe = () => {
          if (observer) {
            observer.unobserve(element);
          } else {
            intersectionObserver?.disconnect();
          }
        };

        return unsubscribe;
      }
    ).pipe(
      map((entries: IntersectionObserverEntry[]) => {
        return Object.assign(
          entries
            .slice()
            .reverse()
            .find((entry) => entry.target === element) ||
            (({
              target: element,
              isIntersecting: false,
              isVisible: false,
            } as any) as IntersectionObserverableEntry),
          {
            observer,
            entries,
          }
        );
      }),
      distinctUntilChanged(
        (
          prevEntry: IntersectionObserverableEntry,
          currEntry: IntersectionObserverableEntry
        ) => prevEntry.isIntersecting === currEntry.isIntersecting
      )
    );
  }

  public getElementInViewEvent(
    element: HTMLElement,
    config: IntersectionObservableConfig = ELEMENT_IN_VIEW_CONFIG_DEF
  ): Observable<boolean> {
    return this.getIntersectionObservable(element, config).pipe(
      map((entry: IntersectionObserverEntry) => entry.isIntersecting),
      config.delayEmit ? delay(config.delayEmit) : pass
    );
  }

  private compareDOMRects(
    rectA: Partial<DOMRectReadOnly>,
    rectB: Partial<DOMRectReadOnly>,
    config: ResizeObservableConfig = RESIZE_OBSERVERVABLE_CONFIG_DEF
  ): boolean {
    return (
      (config.watch !== 'height' &&
        Math.abs(rectA.width - rectB.width) > (config.threshold || 0)) ||
      (config.watch !== 'width' &&
        Math.abs(rectA.height - rectB.height) > (config.threshold || 0))
    );
  }

  private processMutations(
    mutations: MutationRecord[],
    observedElement: HTMLElement,
    config: MutationObservableConfig,
    win: WindowLike = this.nativeWindow
  ): Set<HTMLElement> {
    let affectedElements: Set<HTMLElement> = new Set();

    mutations.forEach((mutation: MutationRecord) => {
      //
      if (mutation.type === 'childList' && config.childList) {
        if (mutation.addedNodes.length) {
          affectedElements = new Set([
            ...affectedElements,
            ...Array.from(mutation.addedNodes),
          ]) as Set<HTMLElement>;
        }
      }

      if (
        mutation.type === 'characterData' &&
        config.characterData &&
        mutation.target.nodeType !== 8
      ) {
        affectedElements.add(
          isDomElement(mutation.target, win)
            ? mutation.target
            : mutation.target.parentElement
        );
      }

      if (
        mutation.type === 'attributes' &&
        (config.attributes || config.attributeFilter)
      ) {
        affectedElements.add(mutation.target as HTMLElement);
      }
    });

    const filteredElements: Set<HTMLElement> = new Set();

    if (config.filterSelector || config.filterBy) {
      affectedElements.forEach((el) => {
        let target = isNotEmptyString(config.filterSelector)
          ? this.DOM.getClosestUntil(el, config.filterSelector, observedElement)
          : el;

        if (isFunction(config.filterBy) && !config.filterBy(el)) {
          target = undefined;
        }

        if (target && target !== observedElement && document.contains(target)) {
          filteredElements.add(target);
        }
      });

      return filteredElements;
    }

    return affectedElements;
  }
}
