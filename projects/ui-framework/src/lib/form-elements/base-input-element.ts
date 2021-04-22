import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Keys } from '../enums';
import { isKey, notFirstChanges } from '../services/utils/functional-utils';
import { stringyOrFail } from '../services/utils/transformers';
import { DOMInputEvent } from '../types';
import { BaseFormElement } from './base-form-element';
import { InputEventType } from './form-elements.enum';
import { InputTypes } from './input/input.enum';
import { BInputEvent } from './input/input.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseInputElement extends BaseFormElement {
  protected constructor(
    protected cd: ChangeDetectorRef,
    protected zone: NgZone
  ) {
    super(cd);
    this.inputTransformers = [stringyOrFail];

    this.baseValue = '';
    this.forceElementValue = true;
  }

  @Input() step: number;
  @Input() value: any = '';
  @Input() inputType: InputTypes = InputTypes.text;

  @Input() minChars: number;
  @Input() maxChars: number;
  @Input() min = 0;
  @Input() max: number;

  // tslint:disable-next-line: no-output-rename
  @Output('inputEvents') changed: EventEmitter<
    BInputEvent<string>
  > = new EventEmitter<BInputEvent<string>>();

  @HostBinding('attr.hidden') get isHidden() {
    return this.inputType === InputTypes.hidden ? 'hidden' : null;
  }

  readonly eventType = InputEventType;
  public input: ElementRef<HTMLInputElement>;

  onNgChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes, ['inputType'], true)) {
      this.value = this.baseValue;
    }
  }

  public onInputChange(
    event: DOMInputEvent,
    forceElementValue: any = this.forceElementValue
  ): void {
    const value = event.target.value;

    // tslint:disable-next-line: triple-equals
    if (value != this.value) {
      this.writeValue(value, forceElementValue);
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
    this.cd.detectChanges();
  }

  public onInputBlur(event: FocusEvent): void {
    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
    this.inputFocused = false;
    this.cd.detectChanges();
  }

  public onInputKeydown(event: KeyboardEvent): void {
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
