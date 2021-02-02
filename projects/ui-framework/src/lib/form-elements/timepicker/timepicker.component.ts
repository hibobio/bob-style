import {
  Component,
  forwardRef,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import {
  padWith0,
  isString,
  isKey,
  isNumber,
  isNullOrUndefined,
} from '../../services/utils/functional-utils';
import { timeyOrFail } from '../../services/utils/transformers';
import { InputEventType } from '../form-elements.enum';
import { Keys } from '../../enums';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { InputAutoCompleteOptions } from '../input/input.enum';

interface ParseConfig {
  minValue?: number;
  maxValue: number;
  mod?: number;
  round?: number;
  pad?: number;
  def?: any;
}

const BTP_PARSE_CONFIG_DEF: ParseConfig = {
  minValue: 0,
  maxValue: undefined,
  mod: 0,
  round: 1,
  pad: 2,
  def: '',
};

@Component({
  selector: 'b-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['../input/input.component.scss', './timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
    { provide: BaseFormElement, useExisting: TimePickerComponent },
  ],
})
export class TimePickerComponent extends BaseFormElement {
  constructor(
    cd: ChangeDetectorRef,
    private zone: NgZone,
    private kbrdCntrlSrvc: FormElementKeyboardCntrlService
  ) {
    super(cd);

    this.inputTransformers = [
      timeyOrFail,
      (value: string) => {
        this.valueHours = this.splitValue(value, 0);
        this.valueMinutes = this.splitValue(value, 1);
        return this.combineValue(this.valueHours, this.valueMinutes);
      },
    ];

    this.baseValue = null;
  }

  @ViewChild('inputHours', { static: true }) inputHours: ElementRef;
  @ViewChild('inputMinutes', { static: true }) inputMinutes: ElementRef;

  public valueHours: string;
  public valueMinutes: string;
  public hoursFocused = false;
  public minutesFocused = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly autoComplete = InputAutoCompleteOptions;

  onInputKeydown(event: KeyboardEvent) {
    if (!this.kbrdCntrlSrvc.filterAllowedKeys(event, /[0-9]/)) {
      return;
    }

    if (isKey(event.key, Keys.arrowright)) {
      if (
        this.hoursFocused &&
        this.inputHours.nativeElement.selectionStart >=
          this.inputHours.nativeElement.value.length
      ) {
        event.preventDefault();
        this.switchInputs();
      }
    }
    if (isKey(event.key, Keys.arrowleft)) {
      if (
        this.minutesFocused &&
        this.inputMinutes.nativeElement.selectionStart === 0
      ) {
        event.preventDefault();
        this.switchInputs();
      }
    }
    if (isKey(event.key, Keys.arrowup)) {
      event.preventDefault();
      if (this.hoursFocused) {
        this.inputHours.nativeElement.value = this.valueHours = this.parseValue(
          this.inputHours.nativeElement.value,
          { maxValue: 23, mod: 1, def: '00' }
        );
        if (this.inputHours.nativeElement.value === '23') {
          this.switchInputs();
        } else {
          this.inputHours.nativeElement.setSelectionRange(2, 2);
          this.zone.run(() => {
            this.transmit(InputEventType.onChange);
          });
        }
      }
      if (this.minutesFocused) {
        this.inputMinutes.nativeElement.value = this.valueMinutes = this.parseValue(
          this.inputMinutes.nativeElement.value,
          { maxValue: 59, mod: 5, def: '00', round: 5 }
        );
        this.inputMinutes.nativeElement.setSelectionRange(2, 2);
        this.zone.run(() => {
          this.transmit(InputEventType.onChange);
        });
      }
    }
    if (isKey(event.key, Keys.arrowdown)) {
      event.preventDefault();
      if (this.hoursFocused) {
        this.inputHours.nativeElement.value = this.valueHours = this.parseValue(
          this.inputHours.nativeElement.value,
          { maxValue: 23, mod: -1, def: '00' }
        );
        this.inputHours.nativeElement.setSelectionRange(2, 2);
        this.zone.run(() => {
          this.transmit(InputEventType.onChange);
        });
      }
      if (this.minutesFocused) {
        this.inputMinutes.nativeElement.value = this.valueMinutes = this.parseValue(
          this.inputMinutes.nativeElement.value,
          { maxValue: 59, mod: -5, def: '00', round: 5 }
        );
        if (this.inputMinutes.nativeElement.value === '00') {
          this.switchInputs();
        } else {
          this.inputMinutes.nativeElement.setSelectionRange(2, 2);
          this.zone.run(() => {
            this.transmit(InputEventType.onChange);
          });
        }
      }
    }
  }

  onHoursChange(event) {
    if (event.target.value.length > 1) {
      this.inputMinutes.nativeElement.focus();
    }
  }

  onMinutesChange(event) {
    if (event.target.value.length > 1) {
      this.inputMinutes.nativeElement.blur();
    }
  }

  onHoursFocus() {
    this.hoursFocused = true;
    this.minutesFocused = false;
    this.cd.detectChanges();
    this.inputHours.nativeElement.select();
  }

  onMinutesFocus() {
    this.minutesFocused = true;
    this.hoursFocused = false;
    this.inputMinutes.nativeElement.select();
    this.cd.detectChanges();
  }

  onHoursBlur(event: FocusEvent) {
    this.hoursFocused = false;
    this.inputHours.nativeElement.value = this.valueHours = this.parseValue(
      (event.target as HTMLInputElement).value,
      { maxValue: 23 }
    );
    this.transmit(InputEventType.onBlur);
  }

  onMinutesBlur(event: FocusEvent) {
    this.minutesFocused = false;
    this.inputMinutes.nativeElement.value = this.valueMinutes = this.parseValue(
      (event.target as HTMLInputElement).value,
      { maxValue: 59 }
    );
    this.transmit(InputEventType.onBlur);
  }

  isInputEmpty() {
    return !(
      (this.valueHours && this.valueHours !== '00') ||
      (this.valueMinutes && this.valueMinutes !== '00')
    );
  }

  clearInput() {
    this.value = this.valueMinutes = this.valueHours = null;
    this.transmitValue(this.value, {
      eventType: [InputEventType.onChange],
    });
  }

  private transmit(eventType = InputEventType.onChange) {
    const newValue = this.combineValue(this.valueHours, this.valueMinutes);
    if (this.value !== newValue) {
      this.value = newValue;
      this.transmitValue(this.value, { eventType: [eventType] });
    }
  }

  private parseValue(value: string, config: ParseConfig = {} as any): string {
    config = { ...BTP_PARSE_CONFIG_DEF, ...config };

    const parsed = parseInt(value, 10);
    if (parsed !== parsed) {
      return config.def;
    }

    return config.mod > -1
      ? padWith0(
          Math.min(
            Math.max(
              Math.floor((parsed + config.mod) / config.round) * config.round,
              config.minValue
            ),
            config.maxValue
          ),
          config.pad
        )
      : padWith0(
          Math.max(
            Math.min(
              Math.ceil((parsed + config.mod) / config.round) * config.round,
              config.maxValue
            ),
            config.minValue
          ),
          config.pad
        );
  }

  private splitValue(value: string, index = 0): any {
    return isString(value) || isNumber(value)
      ? this.parseValue(
          value.split(':')[index],
          index === 0 ? { maxValue: 23 } : { maxValue: 59 }
        )
      : undefined;
  }

  private combineValue(valueHours: string, valueMinutes: string): string {
    return (valueHours === '' || isNullOrUndefined(valueHours)) &&
      (valueMinutes === '' || isNullOrUndefined(valueMinutes))
      ? null
      : `${valueHours || '00'}:${valueMinutes || '00'}`;
  }

  private switchInputs() {
    if (this.hoursFocused) {
      this.inputMinutes.nativeElement.focus();
      this.inputMinutes.nativeElement.setSelectionRange(0, 0);
    } else if (this.minutesFocused) {
      this.inputHours.nativeElement.focus();
      this.inputHours.nativeElement.setSelectionRange(2, 2);
    }
  }
}
