import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { DOMhelpers } from '../html/dom-helpers.service';
import {
  isDomElement,
  isFunction,
  isNumber,
  pass,
} from '../utils/functional-utils';
import { log } from '../utils/logger';
import { MutationObservableService } from '../utils/mutation-observable';

export interface ItemsInRowConfig<R extends boolean> {
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
  extended?: R;
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

  getItemsInRow$<R extends boolean>({
    hostElem,
    elemWidth,
    gapSize = 0,
    minItems = 1,
    update$ = new BehaviorSubject([] as any),
    calcItemsFit = this.calcItemsFit,
    extended = false as any,
  }: ItemsInRowConfig<R>): Observable<
    R extends true ? { itemsInRow: number; childCount?: number } : number
  > {
    //
    calcItemsFit = isFunction(calcItemsFit) ? calcItemsFit : this.calcItemsFit;

    if (!isDomElement(hostElem)) {
      log.err(
        `host element was not provided`,
        'ItemsInRowService.getItemsInRow$'
      );
      this.setCssProps(hostElem, elemWidth, gapSize, 1);
      return of(extended ? { itemsInRow: minItems } : minItems) as any;
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

      this.mutationObservableService
        .getMutationObservable(hostElem, {
          characterData: false,
          attributes: false,
          subtree: false,
          childList: true,
          removedElements: true,
          outsideZone: true,
          bufferTime: 200,
        })
        .pipe(startWith(1)),
    ]).pipe(
      map(
        ([update, elemRect]: [
          [newHostEl: HTMLElement, newElemWidth: number, newGapSize: number],
          DOMRectReadOnly,
          Set<HTMLElement>
        ]) => {
          return {
            itemsInRow: calcItemsFit(
              elemRect?.width ||
                this.DOM.getClosest(hostElem, this.DOM.getInnerWidth, 'result'),
              elemWidth,
              gapSize,
              minItems
            ),
            childCount: ((update && update[0]) || hostElem).childElementCount,
          };
        }
      ),
      distinctUntilChanged((prev, curr) => {
        return (
          prev.itemsInRow === curr.itemsInRow &&
          prev.childCount === curr.childCount
        );
      }),
      tap(({ itemsInRow }) => {
        this.setCssProps(hostElem, elemWidth, gapSize, itemsInRow);
      }),
      !extended ? map(({ itemsInRow }) => itemsInRow as any) : pass
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
