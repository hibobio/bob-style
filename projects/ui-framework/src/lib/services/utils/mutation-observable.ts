import { Injectable } from '@angular/core';
import { merge, Observable, Subscriber } from 'rxjs';
import {
  WindowRef,
  WindowLike,
  ResizeObserverInstance,
} from './window-ref.service';
import { isDomElement, pass } from './functional-utils';
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
}

export const MUTATION_OBSERVABLE_CONFIG_DEF: MutationObservableConfig = {
  characterData: true,
  childList: true,
  subtree: true,
  attributeFilter: ['src', 'data-loaded', 'data-updated'],
  mutations: 'processed',
};

export const RESIZE_OBSERVERVABLE_CONFIG_DEF: ResizeObservableConfig = {
  watch: 'both',
  threshold: 10,
};

export const INTERSECTION_OBSERVABLE_CONFIG_DEF: IntersectionObservableConfig = {};

export const ELEMENT_IN_VIEW_CONFIG_DEF: IntersectionObservableConfig = {
  ...INTERSECTION_OBSERVABLE_CONFIG_DEF,
  delayEmit: 100,
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
    this.nativeWindow = this.windowRef.nativeWindow || window;
  }

  private nativeWindow: WindowLike;

  public getMutationObservable(
    element: HTMLElement,
    config: MutationObservableConfig = MUTATION_OBSERVABLE_CONFIG_DEF
  ): Observable<Set<HTMLElement>> {
    //
    return new Observable((subscriber: Subscriber<Set<HTMLElement>>) => {
      const mutationObserver: MutationObserver = new this.nativeWindow.MutationObserver(
        (mutations: MutationRecord[]) => {
          const affectedElementsSet = this.processMutations(
            mutations,
            element,
            config
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
    config: ResizeObservableConfig = RESIZE_OBSERVERVABLE_CONFIG_DEF
  ): Observable<Partial<DOMRectReadOnly>> {
    //

    if (!this.nativeWindow.ResizeObserver) {
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

        const resizeObserver: ResizeObserverInstance = new this.nativeWindow.ResizeObserver(
          (entries) => {
            const newRect = entries[entries.length - 1].contentRect;

            if (this.compareDOMRects(lastRect, newRect, config)) {
              subscriber.next({ ...newRect });
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
    observer: IntersectionObserver = null
  ): Observable<IntersectionObserverableEntry> {
    //
    if (
      !('IntersectionObserver' in this.nativeWindow) ||
      !('IntersectionObserverEntry' in this.nativeWindow) ||
      !(
        'intersectionRatio' in
        this.nativeWindow.IntersectionObserverEntry.prototype
      )
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
          new this.nativeWindow.IntersectionObserver((entries) => {
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
          entries.reverse().find((entry) => entry.target === element) || {},
          {
            observer,
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
    config: MutationObservableConfig
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
          isDomElement(mutation.target)
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

    if (config.filterSelector) {
      affectedElements.forEach((el) => {
        const target = this.DOM.getClosestUntil(
          el,
          config.filterSelector,
          observedElement
        );

        if (target && target !== observedElement && document.contains(target)) {
          filteredElements.add(target);
        }
      });
    }

    return config.filterSelector ? filteredElements : affectedElements;
  }
}
