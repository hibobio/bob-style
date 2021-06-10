import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Keys } from '../../enums';
import { FORM_ELEMENT_HEIGHT } from '../../form-elements/form-elements.const';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { isKey } from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { DOMKeyboardEvent } from '../../types';
import { LIST_EL_HEIGHT } from '../list.consts';

@Injectable({
  providedIn: 'root',
})
export class ListKeyboardService {
  constructor(private utilSrvc: UtilsService) {}

  getKeyboardNavigationObservable(): Observable<DOMKeyboardEvent> {
    return this.utilSrvc
      .getWindowKeydownEvent()
      .pipe(
        filter(
          (e: DOMKeyboardEvent) =>
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
    let nextFocusIndex: number;
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

  getScrollToIndex({
    focusIndex,
    listHeight,
    size,
  }: {
    focusIndex: number;
    listHeight: number;
    size: FormElementSize;
  }): number {
    return (
      focusIndex -
      listHeight / (FORM_ELEMENT_HEIGHT[size] || LIST_EL_HEIGHT) +
      2
    );
  }
}
