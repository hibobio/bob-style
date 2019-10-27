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
  isNullOrUndefined,
  cloneValue
} from '../services/utils/functional-utils';
import { InputEventType } from './form-elements.enum';
import { FormEvents } from './form-elements.enum';
import { TransmitOptions } from './form-elements.interface';

export abstract class BaseFormElement
  implements ControlValueAccessor, OnChanges {
  protected constructor() {}

  @Input() label: string;
  @Input() description: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() warnMessage: string;
  @Input() doPropagate = true;
  @Input() emitOnWrite = false;

  public inputFocused: boolean | boolean[] = false;
  public id = simpleUID('bfe-');
  public inputTransformers: Function[] = [];
  public outputTransformers: Function[] = [];
  public wrapEvent = true;
  public baseValue;

  private transmitValueDefOptions: Partial<TransmitOptions> = {
    eventType: [InputEventType.onChange],
    eventName: FormEvents.changed,
    doPropagate: this.doPropagate,
    addToEventObj: {},
    saveValue: false
  };

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.disabled') @Input() disabled = false;
  @HostBinding('class.required') @Input() required = false;
  @HostBinding('class.readonly') @Input() readonly = false;

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
    if (value !== undefined) {
      this.value = this.inputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value
      );
    }
    if (isNullOrUndefined(this.value) && this.baseValue !== undefined) {
      this.value = cloneValue(this.baseValue);
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
    const {
      eventType,
      eventName,
      doPropagate,
      addToEventObj,
      saveValue
    } = options;

    // If value is undefined, it will not be transmitted.
    // Transformers may intentionally set value to undefined,
    // to prevent transmission
    if (
      value !== undefined &&
      (doPropagate || saveValue || this[eventName].observers.length > 0)
    ) {
      value = this.outputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value
      );
      if (value === undefined && this.baseValue !== undefined) {
        value = cloneValue(this.baseValue);
      }
      if (saveValue) {
        this.value = value;
      }

      if (
        eventName &&
        this[eventName].observers.length > 0 &&
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
