import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LIST_EL_HEIGHT } from '../list.consts';

export enum NavigationKeys {
  up = 'ArrowUp',
  down = 'ArrowDown',
  enter = 'Enter',
}

@Injectable()
export class ListKeyboardService {
  constructor() {
  }

  getKeyboardNavigationObservable(): Observable<KeyboardEvent> {
    return fromEvent(document, 'keydown')
      .pipe(filter((e: KeyboardEvent) =>
        e.code === NavigationKeys.up ||
        e.code === NavigationKeys.down ||
        e.code === NavigationKeys.enter
      ));
  }

  getFocusIndex(
    navKey: NavigationKeys,
    focusIndex: number,
    listLength: number,
  ): number {
    let nextFocusIndex;
    switch (navKey) {
      case(NavigationKeys.down):
        nextFocusIndex = (focusIndex + 1) % listLength;
        break;
      case(NavigationKeys.up):
        nextFocusIndex = (focusIndex - 1) > -1 ? focusIndex - 1 : listLength - 1;
        break;
      default:
        break;
    }
    return nextFocusIndex;
  }

  getScrollToIndex(
    focusIndex: number,
    listHeight: number,
  ): number {
     return focusIndex - (listHeight / LIST_EL_HEIGHT) + 2;
  }
}
