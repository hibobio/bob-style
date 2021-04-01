import { merge, Observable, of, Subscriber } from 'rxjs';
import {
  bufferTime,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  take,
  tap,
  throttleTime,
} from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';

import {
  arrayFlatten,
  elementIsInView,
  getClosestUntil,
  getElementWindow,
  getType,
  isDomElement,
  isFunction,
  isNotEmptyString,
  isNumber,
  pass,
} from './functional-utils';
import { log } from './logger';
import { insideZone } from './rxjs.operators';
import { UtilsService } from './utils.service';
import {
  ResizeObserverEntry,
  ResizeObserverInstance,
  WindowLike,
  WindowRef,
} from './window-ref.service';

export interface MutationObservableConfig extends MutationObserverInit {
  mutations?: 'processed';
  filterSelector?: string;
  filterBy?: (node: Node) => boolean;
  removedElements?: boolean;
  bufferTime?: number | boolean;
  outsideZone?: boolean;
}

export interface ResizeObservableConfig {
  watch?: 'both' | 'width' | 'height';
  threshold?: number;
  debounceTime?: number | boolean;
  outsideZone?: boolean;
}

// tslint:disable-next-line: no-empty-interface
export interface IntersectionObservableConfig extends IntersectionObserverInit {
  delayEmit?: number;
  debounceTime?: number | boolean;
  outsideZone?: boolean;
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
  removedElements: false,
  bufferTime: false,
};

export const RESIZE_OBSERVERVABLE_CONFIG_DEF: ResizeObservableConfig = {
  watch: 'both',
  threshold: 10,
  debounceTime: false,
};

export const INTERSECTION_OBSERVABLE_CONFIG_DEF: IntersectionObservableConfig = {
  debounceTime: false,
};

export const ELEMENT_IN_VIEW_CONFIG_DEF: IntersectionObservableConfig = {
  threshold: 0.8,
};

@Injectable({
  providedIn: 'root',
})
export class MutationObservableService {
  constructor(
    private windowRef: WindowRef,
    private utilsService: UtilsService,
    private zone: NgZone
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
      log.err(
        `valid element to observe was not provided - got "${getType(
          element
        )}" instead`,
        'MutationObservableService.getMutationObservable'
      );
      return of(new Set());
    }

    if (
      !config.attributes &&
      !config.attributeFilter &&
      !config.characterData &&
      !config.childList
    ) {
      config = { ...MUTATION_OBSERVABLE_CONFIG_DEF, ...config };
    }
    let observable: Observable<Set<HTMLElement>>;

    this.zone.runOutsideAngular(() => {
      observable = new Observable(
        (subscriber: Subscriber<Set<HTMLElement>>) => {
          //
          const mutationObserver: MutationObserver = new win.MutationObserver(
            (mutations: MutationRecord[]) => {
              //
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
        }
      );
    });

    return !config.bufferTime
      ? config.outsideZone === true
        ? observable
        : observable.pipe(insideZone(this.zone))
      : observable.pipe(
          bufferTime<Set<HTMLElement>>(
            isNumber(config.bufferTime) ? config.bufferTime : 100
          ),
          filter<Set<HTMLElement>[]>((sets) => Boolean(sets.length)),
          //
          map<Set<HTMLElement>[], Set<HTMLElement>>((collectedResults) => {
            return new Set(
              arrayFlatten(collectedResults.map((s) => Array.from(s)))
            );
          }),
          config.outsideZone !== true ? insideZone(this.zone) : pass
        );
  }

  public getResizeObservervable(
    element: HTMLElement,
    config: ResizeObservableConfig = {},
    win: WindowLike = this.nativeWindow
  ): Observable<Partial<DOMRectReadOnly>> {
    //
    win = win || (getElementWindow(element) as any);

    config = { ...RESIZE_OBSERVERVABLE_CONFIG_DEF, ...config };

    if (!isDomElement(element, win)) {
      log.err(
        `valid element to observe was not provided - got "${getType(
          element
        )}" instead`,
        'MutationObservableService.getResizeObservervable'
      );
      return of({ width: 0, height: 0 });
    }

    let observable: Observable<Partial<DOMRectReadOnly>>;
    let lastRect: Partial<DOMRectReadOnly> = { width: 0, height: 0 };

    if (!win.ResizeObserver) {
      log.wrn(
        `This browser doesn't support ResizeObserver`,
        'MutationObservableService.getResizeObservervable'
      );

      observable = this.utilsService.getResizeEvent(true).pipe(
        map(() => {
          return {
            width: element.offsetWidth,
            height: element.offsetHeight,
          };
        })
      );
    } else {
      this.zone.runOutsideAngular(() => {
        //
        observable = new Observable(
          (subscriber: Subscriber<Partial<DOMRectReadOnly>>) => {
            //
            const resizeObserver: ResizeObserverInstance = new win.ResizeObserver(
              (entries: ResizeObserverEntry[]) => {
                subscriber.next(entries[entries.length - 1].contentRect);
              }
            );
            resizeObserver.observe(element);

            const unsubscribe = () => {
              resizeObserver.disconnect();
            };

            return unsubscribe;
          }
        );
      });
    }

    return observable.pipe(
      !config.debounceTime || !win.ResizeObserver
        ? pass
        : debounceTime(
            isNumber(config.debounceTime) ? config.debounceTime : 100
          ),
      filter((newRect) => {
        return this.compareDOMRects(lastRect, newRect, config);
      }),
      tap((rect) => {
        lastRect = rect;
      }),
      !config.outsideZone ? insideZone(this.zone) : pass
    );
  }

  public getIntersectionObservable(
    element: HTMLElement,
    config: IntersectionObservableConfig = {},
    observer: IntersectionObserver = null,
    win: WindowLike = this.nativeWindow
  ): Observable<IntersectionObserverableEntry> {
    //
    win = win || (getElementWindow(element) as any);

    config = { ...INTERSECTION_OBSERVABLE_CONFIG_DEF, ...config };

    if (!isDomElement(element, win)) {
      log.err(
        `valid element to observe was not provided - got "${getType(
          element
        )}" instead`,
        'MutationObservableService.getIntersectionObservable'
      );
      return of({
        target: element,
        isIntersecting: false,
        isVisible: false,
      } as any);
    }

    let observable: Observable<IntersectionObserverableEntry>;

    if (
      !('IntersectionObserver' in win) ||
      !('IntersectionObserverEntry' in win) ||
      !('intersectionRatio' in win.IntersectionObserverEntry?.prototype)
    ) {
      log.wrn(
        `This browser doesn't support IntersectionObserver`,
        'MutationObservableService.getIntersectionObservable'
      );

      observable = merge(
        this.utilsService.getScrollEvent(true),
        this.utilsService.getResizeEvent(true)
      ).pipe(
        startWith(1),
        throttleTime(300, undefined, {
          leading: true,
          trailing: true,
        }),
        map(() => elementIsInView(element, win)),
        distinctUntilChanged(),
        map(
          (isInView) =>
            (({
              target: element,
              isIntersecting: isInView,
              isVisible: isInView,
            } as any) as IntersectionObserverableEntry)
        ),
        insideZone(this.zone)
      );
    }

    this.zone.runOutsideAngular(() => {
      observable = new Observable(
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
    });

    return observable.pipe(
      !config.outsideZone ? insideZone(this.zone) : pass,
      !config.debounceTime
        ? pass
        : debounceTime(
            isNumber(config.debounceTime) ? config.debounceTime : 100
          )
    );
  }

  public getElementInViewEvent(
    element: HTMLElement,
    config: IntersectionObservableConfig = {}
  ): Observable<boolean> {
    config = { ...ELEMENT_IN_VIEW_CONFIG_DEF, ...config };
    return this.getIntersectionObservable(element, config).pipe(
      map((entry: IntersectionObserverEntry) => entry.isIntersecting),
      config.delayEmit > 0 ? delay(config.delayEmit) : pass
    );
  }

  public getElementFirstInViewEvent(
    element: HTMLElement,
    config: IntersectionObservableConfig = {}
  ): Observable<boolean> {
    return this.getElementInViewEvent(element, config).pipe(
      filter((e) => e === true),
      take(1)
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
    win: WindowLike | Window = this.nativeWindow
  ): Set<HTMLElement> {
    let affectedElements: Set<HTMLElement> = new Set();

    try {
      win = win || getElementWindow(observedElement);
      const doc = win.document;

      mutations.forEach((mutation: MutationRecord) => {
        //
        if (mutation.type === 'childList' && config.childList) {
          if (
            mutation.addedNodes.length ||
            (config.removedElements && mutation.removedNodes.length)
          ) {
            affectedElements = new Set([
              ...affectedElements,
              ...Array.from(mutation.addedNodes),
              ...(config.removedElements
                ? Array.from(mutation.removedNodes)
                : []),
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
            ? getClosestUntil(el, config.filterSelector, observedElement, win)
            : el;

          if (!el || (isFunction(config.filterBy) && !config.filterBy(el))) {
            target = undefined;
          }

          if (
            target &&
            target !== observedElement &&
            (config.removedElements || doc.contains(target))
          ) {
            filteredElements.add(target);
          }
        });

        return filteredElements;
      }
    } catch (error) {
      log.err(error, 'processMutations');
    }

    return affectedElements;
  }
}
