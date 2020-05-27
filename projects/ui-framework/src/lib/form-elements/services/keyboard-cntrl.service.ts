import { Injectable } from '@angular/core';
import { controlKeys, Keys } from '../../enums';
import {
  isNumber,
  eventHasCntrlKey,
} from '../../services/utils/functional-utils';

export interface InputCursorState {
  value: string;
  valueLength: number;
  selectionStart: number;
  selectionEnd: number;
  nextChar: string;
  prevChar: string;
  selection: string;
  selectionLength: number;
  positionMod: number;
}

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

  public getInputCursorState(inputEl: HTMLInputElement): InputCursorState {
    const value = inputEl.value,
      valueLength = inputEl.value.length,
      selectionStart = inputEl.selectionStart,
      selectionEnd = inputEl.selectionEnd;

    const nextChar = value[selectionEnd],
      prevChar = value[selectionStart - 1],
      selection = value.slice(selectionStart, selectionEnd);

    return {
      value,
      valueLength,
      selectionStart,
      selectionEnd,
      nextChar,
      prevChar,
      selection,
      selectionLength: selection.length,
      positionMod: 0,
    };
  }

  public setCursorAtIndex(inputEl: HTMLInputElement, index?: number): void {
    inputEl.selectionStart = inputEl.selectionEnd = Math.max(index || 0, 0);
  }
}
