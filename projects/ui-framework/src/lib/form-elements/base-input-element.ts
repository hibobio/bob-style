import {
  EventEmitter,
  Input,
  Output,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import { InputAutoCompleteOptions, InputTypes } from './input/input.enum';
import { FormEvents, InputEventType } from './form-elements.enum';
import { isKey, parseToNumber } from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { asNumber, stringyOrFail } from '../services/utils/transformers';
import { FormElementKeyboardCntrlService } from './services/keyboard-cntrl.service';

export abstract class BaseInputElement extends BaseFormElement {
  protected constructor(
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected kbrdCntrlSrvc: FormElementKeyboardCntrlService
  ) {
    super();
    this.inputTransformers = [
      stringyOrFail,
      value => asNumber(this.inputType, value)
    ];
    this.outputTransformers = [value => asNumber(this.inputType, value)];
    this.baseValue = '';
  }

  public eventType = InputEventType;
  readonly inputTypes = InputTypes;

  @Input() value = '';
  @Input() inputType: InputTypes = InputTypes.text;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Input() minChars: number;
  @Input() maxChars: number;
  @Input() min: number;
  @Input() max: number;

  @Output(FormEvents.inputEvents) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  onInputChange(event) {
    if (event.target.value !== this.value) {
      this.writeValue(event.target.value);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange]
      });
    }
  }

  onInputFocus() {
    this.transmitValue(this.value, { eventType: [InputEventType.onFocus] });
    this.inputFocused = true;
  }

  onInputBlur(event) {
    if (this.inputType === InputTypes.number) {
      const value = (<HTMLInputElement>event.target).value;
      const parsed = parseToNumber(value);

      if (
        (value !== '' && (this.min && parsed < this.min)) ||
        (this.max && parsed > this.max)
      ) {
        this.writeValue(parsed < this.min ? this.min : this.max);
        this.transmitValue(this.value, {
          eventType: [InputEventType.onChange]
        });
      }
    }

    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
    this.inputFocused = false;
  }

  onInputKeyUp(event: KeyboardEvent) {
    if (
      (isKey(event.key, Keys.enter) || isKey(event.key, Keys.escape)) &&
      this.changed.observers.length > 0
    ) {
      event.stopPropagation();
      this.zone.run(() => {
        this.transmitValue(this.value, {
          eventType: [InputEventType.onKey],
          doPropagate: false,
          addToEventObj: {
            key: event.key
          }
        });
      });
    }
  }
}
