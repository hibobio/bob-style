import { EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import {
  InputAutoCompleteOptions,
  InputEventType,
  InputTypes
} from './input/input.enum';
import { simpleUID, pass } from '../services/utils/functional-utils';

export abstract class BaseInputElement extends BaseFormElement {
  public inputFocused = false;
  public id = simpleUID('bfe-');

  @Input() inputType: InputTypes = InputTypes.text;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  @HostBinding('class')
  get classes(): string {
    return (
      (this.disabled ? 'disabled ' : '') +
      (this.required ? 'required ' : '') +
      (this.errorMessage && !this.disabled ? 'error ' : '') +
      (this.warnMessage && !this.errorMessage && !this.disabled ? 'warn' : '')
    );
  }

  protected constructor() {
    super();
  }

  onChange($event: any, converter = pass): void {
    this.emitInputEvent(
      InputEventType.onChange,
      converter($event.value || $event.target.value)
    );
  }

  onFocus($event: any, converter = pass): void {
    this.inputFocused = true;
    this.emitInputEvent(
      InputEventType.onFocus,
      converter($event.value || $event.target.value)
    );
  }

  onBlur($event: any, converter = pass): void {
    this.inputFocused = false;
    this.emitInputEvent(
      InputEventType.onBlur,
      converter($event.value || $event.target.value)
    );
  }

  emitInputEvent(event: InputEventType, value: string | number): void {
    if (event === InputEventType.onChange) {
      if (value !== this.value) {
        this.value = value;
        this.propagateChange(value);
        this.inputEvents.emit({ event, value });
      }
    }
    if (event === InputEventType.onFocus || event === InputEventType.onBlur) {
      if (value !== this.value) {
        this.value = value;
      }
      this.inputEvents.emit({ event, value: this.value });
    }
    if (event === InputEventType.onBlur) {
      this.propagateChange(this.value);
      this.onTouched();
    }
  }
}
