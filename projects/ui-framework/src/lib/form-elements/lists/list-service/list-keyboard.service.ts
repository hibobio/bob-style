import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LIST_EL_HEIGHT } from '../list.consts';
import { Keys } from '../../../enums';
import { isKey } from '../../../services/utils/functional-utils';
import { UtilsService } from '../../../services/utils/utils.service';

@Injectable()
export class ListKeyboardService {
  constructor(private utilSrvc: UtilsService) {}

  getKeyboardNavigationObservable(): Observable<KeyboardEvent> {
    return this.utilSrvc
      .getWindowKeydownEvent()
      .pipe(
        filter(
          (e: KeyboardEvent) =>
            isKey(e.key, Keys.arrowup) ||
            isKey(e.key, Keys.arrowdown) ||
            isKey(e.key, Keys.enter) ||
            isKey(e.key, Keys.escape)
        )
      );
  }

  getNextFocusIndex(
    navKey: Keys,
    focusIndex: number,
    listLength: number
  ): number {
    let nextFocusIndex;
    switch (navKey) {
      case Keys.arrowdown:
        nextFocusIndex = (focusIndex + 1) % listLength;
        break;
      case Keys.arrowup:
        nextFocusIndex = focusIndex - 1 > -1 ? focusIndex - 1 : listLength - 1;
        break;
      default:
        break;
    }
    return nextFocusIndex;
  }

  getScrollToIndex(focusIndex: number, listHeight: number): number {
    return focusIndex - listHeight / LIST_EL_HEIGHT + 2;
  }
}
