import { EventEmitter, Input, Output } from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import { InputAutoCompleteOptions, InputEventType, InputTypes } from './input';

export abstract class BaseInputElement extends BaseFormElement {

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions = InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  protected constructor() {
    super();
  }

  emitInputEvent(
    event: InputEventType,
    value: string | number,
  ): void {
    this.inputEvents.emit({
      event,
      value,
    });
    if (event === InputEventType.onChange) {
      this.propagateChange(value);
    }
  }
}
