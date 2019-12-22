import {
  EventEmitter,
  Input,
  Output,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import { InputAutoCompleteOptions, InputTypes } from './input/input.enum';
import { FormEvents, InputEventType } from './form-elements.enum';
import { isKey, parseToNumber } from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { valueAsNumber, stringyOrFail } from '../services/utils/transformers';
import { FormElementKeyboardCntrlService } from './services/keyboard-cntrl.service';
import { ConditionalExpr } from '@angular/compiler';

export abstract class BaseInputElement extends BaseFormElement {
  protected constructor(
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected kbrdCntrlSrvc: FormElementKeyboardCntrlService
  ) {
    super(cd);
    this.inputTransformers = [
      stringyOrFail,
      value => valueAsNumber(this.inputType, value),
    ];
    this.outputTransformers = [value => valueAsNumber(this.inputType, value)];
    this.baseValue = '';
  }

  public eventType = InputEventType;
  readonly inputTypes = InputTypes;

  @Input() step = 5;
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

  onInputChange(value: string) {
    if (value !== this.value) {
      this.writeValue(value);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange],
      });
    }
  }

  onInputFocus() {
    this.transmitValue(this.value, { eventType: [InputEventType.onFocus] });
    this.inputFocused = true;
  }

  onInputBlur() {
    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
    this.inputFocused = false;
  }

  processValue(value) {
    if (this.inputType === InputTypes.number) {
      const parsed = parseToNumber(value);

      if (
        (value !== '' && (this.min && parsed < this.min)) ||
        (this.max && parsed > this.max)
      ) {
        this.writeValue(parsed < this.min ? this.min : this.max);
        this.transmitValue(this.value, {
          eventType: [InputEventType.onChange],
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
            key: event.key,
          },
        });
      });
    }
  }
}
