import { Injectable } from '@angular/core';
import { controlKeys, Keys } from '../../enums';
import {
  isNumber,
  eventHasCntrlKey,
} from '../../services/utils/functional-utils';

@Injectable({
  providedIn: 'root',
})
export class FormElementKeyboardCntrlService {
  constructor() {}

  public filterAllowedKeys(
    event: KeyboardEvent,
    allowedKeys = /[0-9,\W]/i
  ): KeyboardEvent {
    if (eventHasCntrlKey(event)) {
      return event;
    }

    event.stopPropagation();

    if (
      !allowedKeys.test(event.key) &&
      !controlKeys.includes(event.key as Keys)
    ) {
      event.preventDefault();
      return null;
    }
  }

  public insertNewLineAtCursor(inputEl: HTMLInputElement): string {
    const cursorPos = inputEl.selectionStart;

    if (!isNumber(cursorPos)) {
      return null;
    }

    inputEl.value =
      inputEl.value.substring(0, cursorPos) +
      '\n' +
      inputEl.value.substring(cursorPos);

    inputEl.setSelectionRange(cursorPos + 1, cursorPos + 1);

    return inputEl.value;
  }
}
