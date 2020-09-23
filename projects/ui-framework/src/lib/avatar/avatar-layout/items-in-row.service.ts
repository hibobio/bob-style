import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { isDomElement } from '../../services/utils/functional-utils';
import { MutationObservableService } from '../../services/utils/mutation-observable';

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

  itemsInRow(
    hostElem: HTMLElement,
    elemWidth: number,
    gapSize: number
  ): number {
    return this.calcItemsFit(
      this.DOM.getInnerWidth(hostElem),
      elemWidth,
      gapSize
    );
  }

  getItemsInRow$(
    hostElem: HTMLElement,
    elemWidth: number,
    gapSize: number = 0,
    minItems: number = 1
  ): Observable<number> {
    this.DOM.setCssProps(hostElem, {
      '--item-width': elemWidth + 'px',
      '--item-grid-gap': gapSize + 'px',
    });

    if (!isDomElement(hostElem)) {
      console.error(
        `[ItemsInRowService.getItemsInRow$] host element was not provided`
      );
      this.DOM.setCssProps(hostElem, {
        '--item-count': minItems,
      });
      return of(minItems);
    }

    return this.mutationObservableService
      .getResizeObservervable(hostElem, {
        watch: 'width',
        threshold: elemWidth / 2,
      })
      .pipe(
        map((elemRect: DOMRectReadOnly) => {
          return this.calcItemsFit(
            elemRect.width ||
              this.DOM.getClosest(hostElem, this.DOM.getInnerWidth, 'result'),
            elemWidth,
            gapSize,
            minItems
          );
        }),
        distinctUntilChanged(),
        tap((itemsInRow: number) => {
          this.DOM.setCssProps(hostElem, {
            '--item-count': itemsInRow,
          });
        })
      );
  }
}
