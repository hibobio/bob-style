import {
  EventEmitter,
  Input,
  Output,
  NgZone,
  ChangeDetectorRef,
  SimpleChanges,
  HostBinding,
  Directive,
} from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import { InputAutoCompleteOptions, InputTypes } from './input/input.enum';
import { InputEventType } from './form-elements.enum';
import { isKey, notFirstChanges } from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { valueAsNumber, stringyOrFail } from '../services/utils/transformers';
import { FormElementKeyboardCntrlService } from './services/keyboard-cntrl.service';
import { DOMInputEvent } from '../types';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseInputElement extends BaseFormElement {
  protected constructor(
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected kbrdCntrlSrvc: FormElementKeyboardCntrlService
  ) {
    super(cd);
    this.inputTransformers = [
      stringyOrFail,
      (value) => valueAsNumber(this.inputType, value),
    ];
    this.outputTransformers = [
      (value) => valueAsNumber(this.inputType, value, 0),
    ];
    this.baseValue = '';
  }

  readonly eventType = InputEventType;

  @Input() step: number;
  @Input() value: any = '';
  @Input() inputType: InputTypes = InputTypes.text;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;

  @Input() minChars: number;
  @Input() maxChars: number;
  @Input() min = 0;
  @Input() max: number;

  // tslint:disable-next-line: no-output-rename
  @Output('inputEvents') changed: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  @HostBinding('attr.hidden') get isHidden() {
    return this.inputType === InputTypes.hidden ? 'hidden' : null;
  }

  onNgChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes, ['inputType'])) {
      this.value = this.baseValue;
    }
  }

  public onInputChange(event: DOMInputEvent): void {
    const value = event.target.value;

    // tslint:disable-next-line: triple-equals
    if (value != this.value) {
      this.writeValue(value, true);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange],
      });
    }
  }

  public onInputFocus(event: FocusEvent): void {
    if (!this.skipFocusEvent) {
      this.transmitValue(this.value, { eventType: [InputEventType.onFocus] });
    }
    this.inputFocused = true;
    this.skipFocusEvent = false;
  }

  public onInputBlur(event: FocusEvent): void {
    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
    this.inputFocused = false;
  }

  public onInputKeydown(event: KeyboardEvent): void {
    if (this.inputType === InputTypes.number) {
      this.kbrdCntrlSrvc.filterAllowedKeys(event, /[0-9.-]/);
    }

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
