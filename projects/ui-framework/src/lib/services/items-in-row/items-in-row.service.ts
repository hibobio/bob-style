import {Injectable} from '@angular/core';
import {DOMhelpers} from '../utils/dom-helpers.service';
import {Observable} from 'rxjs';
import {UtilsService} from '../utils/utils.service';
import {distinctUntilChanged, map, startWith} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemsInRowService {

  constructor(
    private DOM: DOMhelpers,
    private utilsService: UtilsService,
  ) {
  }
  private setCssVars(hostElem: HTMLElement, itemWidth, gapSize): void {
    this.DOM.setCssProps(hostElem, {
      '--item-width': itemWidth + 'px',
      '--item-grid-gap': gapSize + 'px'
    });
  }

  itemsInRow(hostElem: HTMLElement, elemWidth: number, gapSize: number): number {
    const hostWidth = this.DOM.getInnerWidth(hostElem);

    const gaps = (Math.floor(hostWidth / elemWidth) - 1) * gapSize;
    const fullRow = Math.floor((hostWidth - gaps) / elemWidth);

    return fullRow > 1 ? fullRow : 1;
  }

  itemsInRowObserver$(hostElem: HTMLElement, elemWidth: number, gapSize: number): Observable<number> {
    return new Observable(observer => {
      const handler = (itemsInRow) => {
        this.setCssVars(hostElem, elemWidth, gapSize);
        observer.next(itemsInRow);
      };

      const subscription = this.utilsService.getResizeEvent()
        .pipe(
          startWith(true),
          map(() => {
            return this.itemsInRow(hostElem, elemWidth, gapSize);
          }),
          distinctUntilChanged()
        )
        .subscribe((count) => {
          handler(count);
        });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
