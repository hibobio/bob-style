import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { DOMhelpers } from '../html/dom-helpers.service';
import { isDomElement, isFunction, isNumber } from '../utils/functional-utils';
import { log } from '../utils/logger';
import { MutationObservableService } from '../utils/mutation-observable';

export interface ItemsInRowConfig {
  hostElem: HTMLElement;
  elemWidth: number;
  gapSize?: number;
  minItems?: number;
  update$?:
    | BehaviorSubject<[HTMLElement, number, number]>
    | Observable<[HTMLElement, number, number]>;
  calcItemsFit?: (
    availableWidth: number,
    itemWidth: number,
    itemsGap: number,
    minItems: number
  ) => number;
}

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

  getItemsInRow$({
    hostElem,
    elemWidth,
    gapSize = 0,
    minItems = 1,
    update$ = new BehaviorSubject([] as any),
    calcItemsFit = this.calcItemsFit,
  }: ItemsInRowConfig): Observable<number> {
    //
    calcItemsFit = isFunction(calcItemsFit) ? calcItemsFit : this.calcItemsFit;

    if (!isDomElement(hostElem)) {
      log.err(
        `host element was not provided`,
        'ItemsInRowService.getItemsInRow$'
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
          return calcItemsFit(
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
