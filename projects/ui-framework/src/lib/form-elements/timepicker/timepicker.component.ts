import {
  Component,
  forwardRef,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import {
  padWith0,
  isString,
  isKey
} from '../../services/utils/functional-utils';
import { timeyOrFail } from '../../services/utils/transformers';
import { InputEventType } from '../form-elements.enum';
import { Keys } from '../../enums';

@Component({
  selector: 'b-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['../input/input.component.scss', './timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ]
})
export class TimePickerComponent extends BaseFormElement {
  constructor(private cd: ChangeDetectorRef) {
    super();
    this.inputTransformers = [
      timeyOrFail,
      (value: string) => {
        this.valueHours = this.splitValue(value, 0);
        this.valueMinutes = this.splitValue(value, 1);
        return value;
      }
    ];

    this.baseValue = '';
  }
  @ViewChild('inputHours', { static: true }) inputHours: ElementRef;
  @ViewChild('inputMinutes', { static: true }) inputMinutes: ElementRef;

  valueHours: string;
  valueMinutes: string;
  hoursFocused = false;
  minutesFocused = false;

  onInputKeydown(event) {
    event.stopPropagation();
    const allowedKeys = [
      Keys.enter,
      Keys.escape,
      Keys.tab,
      Keys.delete,
      Keys.backspace,
      Keys.arrowleft,
      Keys.arrowright
    ];
    if (/[^0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
    if (isKey(event.key, Keys.arrowright)) {
      if (
        this.hoursFocused &&
        (!this.inputHours.nativeElement.value ||
          this.inputHours.nativeElement.selectionStart >= 2)
      ) {
        this.inputMinutes.nativeElement.focus();
        setTimeout(() => {
          this.inputMinutes.nativeElement.setSelectionRange(0, 0);
        }, 0);
      }
    }
    if (isKey(event.key, Keys.arrowleft)) {
      if (
        this.minutesFocused &&
        this.inputMinutes.nativeElement.selectionStart === 0
      ) {
        this.inputHours.nativeElement.focus();
        setTimeout(() => {
          this.inputHours.nativeElement.setSelectionRange(2, 2);
        }, 0);
      }
    }
  }

  onHoursChange(event) {
    const value = String(this.getValue(event));

    if (value.length >= 2) {
      this.inputMinutes.nativeElement.focus();
    }
  }

  onMinutesChange(event) {
    const value = String(this.getValue(event));

    if (value.length >= 2) {
      this.inputMinutes.nativeElement.blur();
    }
  }

  onHoursFocus() {
    this.hoursFocused = true;
    this.minutesFocused = false;
    this.inputHours.nativeElement.select();
    this.cd.detectChanges();
  }

  onMinutesFocus() {
    this.minutesFocused = true;
    this.hoursFocused = false;
    this.inputMinutes.nativeElement.select();
    this.cd.detectChanges();
  }

  onHoursBlur(event) {
    this.hoursFocused = false;
    let value = this.getValue(event);

    if (value > 23) {
      value = 23;
    }

    this.valueHours = padWith0(value);
    this.transmit();
  }

  onMinutesBlur(event) {
    this.minutesFocused = false;
    let value = this.getValue(event);

    if (value > 59) {
      value = 59;
    }

    this.valueMinutes = padWith0(value);
    this.transmit();
  }

  private transmit() {
    const newValue = this.combineValue(this.valueHours, this.valueMinutes);

    if (this.value !== newValue) {
      this.value = newValue;
      this.transmitValue(this.value, { eventType: [InputEventType.onChange] });
    }
  }

  private getValue(event): number {
    const value = parseInt(event.target.value, 10);
    return value !== value || value < 0 ? 0 : value;
  }

  private splitValue(value: string, index = 0): string {
    return isString(value) ? padWith0(value.split(':')[index]) : undefined;
  }

  private combineValue(valueHours: string, valueMinutes: string): string {
    return `${valueHours || '00'}:${valueMinutes || '00'}`;
  }
}
