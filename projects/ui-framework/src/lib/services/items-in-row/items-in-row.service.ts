import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { DOMhelpers } from '../html/dom-helpers.service';
import { isDomElement, isNumber } from '../utils/functional-utils';
import { MutationObservableService } from '../utils/mutation-observable';

@Injectable({
  providedIn: 'root',
})
export class ItemsInRowService {
  constructor(
    private DOM: DOMhelpers,
    private mutationObservableService: MutationObservableService
  ) {}

  calcItemsFit(
    availableWidth: number,
    itemWidth: number,
    itemsGap: number = 0,
    minItems: number = 1
  ): number {
    const gaps = (Math.floor(availableWidth / itemWidth) - 1) * itemsGap;
    const fullRow = Math.floor((availableWidth - gaps) / itemWidth);
    return Math.max(fullRow, minItems);
  }

  getItemsInRow$(
    hostElem: HTMLElement,
    elemWidth: number,
    gapSize: number = 0,
    minItems: number = 1,
    update$:
      | BehaviorSubject<[HTMLElement, number, number]>
      | Observable<[HTMLElement, number, number]> = new BehaviorSubject(
      [] as any
    )
  ): Observable<number> {
    if (!isDomElement(hostElem)) {
      console.error(
        `[ItemsInRowService.getItemsInRow$] host element was not provided`
      );
      this.setCssProps(hostElem, elemWidth, gapSize, 1);
      return of(minItems);
    }

    return combineLatest([
      update$.pipe(
        tap(
          ([newHostEl, newElemWidth, newGapSize]: [
            HTMLElement,
            number,
            number
          ]) => {
            hostElem = isDomElement(newHostEl) ? newHostEl : hostElem;
            elemWidth = isNumber(newElemWidth) ? newElemWidth : elemWidth;
            gapSize = isNumber(newGapSize) ? newGapSize : gapSize;
          }
        )
      ),
      this.mutationObservableService.getResizeObservervable(hostElem, {
        watch: 'width',
        threshold: elemWidth / 3,
      }),
    ]).pipe(
      map(
        ([update, elemRect]: [
          [HTMLElement, number, number],
          DOMRectReadOnly
        ]) => {
          return this.calcItemsFit(
            elemRect.width ||
              this.DOM.getClosest(hostElem, this.DOM.getInnerWidth, 'result'),
            elemWidth,
            gapSize,
            minItems
          );
        }
      ),
      distinctUntilChanged(),
      tap((itemsInRow: number) => {
        this.setCssProps(hostElem, elemWidth, gapSize, itemsInRow);
      })
    );
  }

  private setCssProps(
    hostElem: HTMLElement,
    elemWidth: number,
    gapSize: number = 0,
    itemsInRow = 1
  ): void {
    this.DOM.setCssProps(hostElem, {
      '--item-width': elemWidth ? elemWidth + 'px' : null,
      '--item-grid-gap': (gapSize || 0) + 'px',
      '--item-count': itemsInRow,
    });
  }
}
