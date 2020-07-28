import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  WindowRef,
  WindowLike,
  ResizeObserverInstance,
} from './window-ref.service';
import { isDomElement } from './functional-utils';
import { DOMhelpers } from '../html/dom-helpers.service';

export interface MutationObservableConfig extends MutationObserverInit {
  mutations?: 'original' | 'processed';
  filterSelector?: string;
}

export interface ResizeObservableConfig {
  watch?: 'both' | 'width' | 'height';
  threshold?: number;
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
  threshold: 20,
};

@Injectable({
  providedIn: 'root',
})
export class MutationObservableService {
  constructor(private windowRef: WindowRef, private DOM: DOMhelpers) {
    this.nativeWindow = this.windowRef.nativeWindow;
  }

  private nativeWindow: WindowLike;

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

  public getMutationObservable(
    element: HTMLElement,
    config: MutationObservableConfig = MUTATION_OBSERVABLE_CONFIG_DEF
  ): Observable<Set<HTMLElement>> {
    //
    return new Observable((observer) => {
      const mutationObserver = new this.nativeWindow.MutationObserver(
        (mutations: MutationRecord[]) => {
          const affectedElementsSet = this.processMutations(
            mutations,
            element,
            config
          );

          if (affectedElementsSet.size) {
            observer.next(affectedElementsSet);
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
  ): Observable<DOMRectReadOnly> {
    //
    return new Observable((observer) => {
      let lastRect: Partial<DOMRectReadOnly> = { width: 0, height: 0 };

      const resizeObserver: ResizeObserverInstance = new this.nativeWindow.ResizeObserver(
        (entries) => {
          const newRect = entries[entries.length - 1].contentRect;

          if (
            (config.watch !== 'height' &&
              Math.abs(lastRect.width - newRect.width) >
                (config.threshold || 0)) ||
            (config.watch !== 'width' &&
              Math.abs(lastRect.height - newRect.height) >
                (config.threshold || 0))
          ) {
            observer.next(newRect);
            lastRect = newRect;
          }
        }
      );

      resizeObserver.observe(element);

      const unsubscribe = () => {
        resizeObserver.disconnect();
      };

      return unsubscribe;
    });
  }
}
