import {
  Input,
  HostBinding,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import {
  simpleUID,
  asArray,
  isNullOrUndefined
} from '../services/utils/functional-utils';
import { InputEventType } from './form-elements.enum';
import { FormEvents } from './form-elements.enum';
import { TransmitOptions } from './form-elements.interface';

export abstract class BaseFormElement
  implements ControlValueAccessor, OnChanges {
  protected constructor() {}

  @Input() label: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Input() hideLabelOnFocus = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() warnMessage: string;
  @Input() doPropagate = true;
  @Input() emitOnWrite = false;

  public inputFocused = false;
  public id = simpleUID('bfe-');
  public inputTransformers: Function[] = [];
  public outputTransformers: Function[] = [];
  public wrapEvent = true;
  public baseValue;

  private transmitValueDefOptions: Partial<TransmitOptions> = {
    eventType: [InputEventType.onChange],
    eventName: FormEvents.changed,
    doPropagate: this.doPropagate,
    addToEventObj: {}
  };

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.disabled') get isDisabled(): boolean {
    return this.disabled;
  }
  @HostBinding('class.required') get isRequired(): boolean {
    return this.required;
  }
  @HostBinding('class.error') get hasError(): boolean {
    return this.errorMessage && !this.disabled;
  }
  @HostBinding('class.warn') get hasWarn(): boolean {
    return this.warnMessage && !this.errorMessage && !this.disabled;
  }
  @HostBinding('class.has-label') get hasLabel(): boolean {
    return this.label && !this.hideLabelOnFocus;
  }
  @HostBinding('class.has-message') get hasMessage(): boolean {
    return (
      !!this.hintMessage ||
      (this.errorMessage && !this.disabled) ||
      (this.warnMessage && !this.disabled)
    );
  }

  protected onNgChanges(changes: SimpleChanges): void {}

  @Input() validateFn: Function = (_: FormControl) => {};

  onTouched: Function = (_: any) => {};

  propagateChange: Function = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  writeValue(value: any): void {
    if (isNullOrUndefined(value) && this.baseValue !== undefined) {
      this.value = this.baseValue;
    } else if (value !== undefined) {
      this.value = this.inputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value
      );
    }
  }

  protected transmitValue(
    value: any = this.value,
    options: Partial<TransmitOptions> = {}
  ): void {
    options = {
      ...this.transmitValueDefOptions,
      ...options
    };
    const { eventType, eventName, doPropagate, addToEventObj } = options;

    // If value is undefined, it will not be transmitted.
    // Transformers may intentionally set value to undefined,
    // to prevent transmission
    if (value !== undefined) {
      value = this.outputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value,
      );

      if (
        eventName &&
        ((!this.emitOnWrite && !eventType.includes(InputEventType.onWrite)) ||
          this.emitOnWrite)
      ) {
        asArray(eventType).forEach(event => {
          this[eventName].emit(
            this.wrapEvent
              ? {
                  event,
                  value,
                  ...addToEventObj
                }
              : value
          );
        });
      }

      if (
        doPropagate &&
        ((!this.emitOnWrite && !eventType.includes(InputEventType.onWrite)) ||
          this.emitOnWrite)
      ) {
        if (!eventType.includes(InputEventType.onFocus)) {
          this.propagateChange(value);
        }

        if (eventType.includes(InputEventType.onBlur)) {
          this.onTouched();
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.writeValue(changes.value.currentValue);
      this.transmitValue(this.value, { eventType: [InputEventType.onWrite] });
    }
    this.onNgChanges(changes);
  }
}
