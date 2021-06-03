import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Keys } from '../../enums';
import { ICON_CONFIG } from '../../icons/common-icons.const';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  isKey,
  isNullOrUndefined,
  isString,
  padWith0,
} from '../../services/utils/functional-utils';
import { timeyOrFail } from '../../services/utils/transformers';
import { TimeFormat } from '../../types';
import { BaseFormElement } from '../base-form-element';
import { InputEventType } from '../form-elements.enum';
import { InputAutoCompleteOptions } from '../input/input.enum';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

interface ParseConfig {
  minValue?: number;
  maxValue: number;
  mod?: number;
  round?: number;
  pad?: number;
  def?: any;
}

const BTP_PARSE_CONFIG_BASE: ParseConfig = {
  minValue: 0,
  maxValue: undefined,
  mod: 0,
  round: 1,
  pad: 2,
  def: '',
};

const BTP_PARSE_CONFIG_BY_TIMEFORMAT: Record<
  TimeFormat,
  { hours: ParseConfig; minutes: ParseConfig }
> = {
  [TimeFormat.Time12]: {
    hours: { ...BTP_PARSE_CONFIG_BASE, minValue: 1, maxValue: 12, def: '00' },
    minutes: { ...BTP_PARSE_CONFIG_BASE, minValue: 0, maxValue: 59, def: '00' },
  },
  [TimeFormat.Time24]: {
    hours: { ...BTP_PARSE_CONFIG_BASE, minValue: 0, maxValue: 23, def: '00' },
    minutes: { ...BTP_PARSE_CONFIG_BASE, minValue: 0, maxValue: 59, def: '00' },
  },
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
    private kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    private hostElRef: ElementRef<HTMLElement>
  ) {
    super(cd);

    this.inputTransformers = [
      timeyOrFail,
      (value: string) => {
        const { time, amPm } = this.adjustToFormat(
          value,
          TimeFormat.Time24,
          this.timeFormat || TimeFormat.Time24
        );
        this.amPm =
          amPm || (this.timeFormat === TimeFormat.Time12 ? 'am' : null);

        this.valueHours = this.splitValue(time, 0);
        this.valueMinutes = this.splitValue(time, 1);

        return this.combineValue(this.valueHours, this.valueMinutes);
      },
    ];

    this.outputTransformers = [
      (value: string) => {
        return this.adjustToFormat(
          value,
          this.timeFormat || TimeFormat.Time24,
          TimeFormat.Time24,
          this.amPm
        ).time;
      },
    ];

    this.baseValue = null;
  }

  @ViewChild('inputHours', { static: true }) inputHours: ElementRef;
  @ViewChild('inputMinutes', { static: true }) inputMinutes: ElementRef;

  @Input('timeFormat') set setTimeFormat(timeFormat: TimeFormat) {
    if (timeFormat) {
      this.parseConfig = BTP_PARSE_CONFIG_BY_TIMEFORMAT[timeFormat];

      const value = this.adjustToFormat(
        this.value,
        this.timeFormat,
        TimeFormat.Time24,
        this.amPm
      ).time;

      this.timeFormat = timeFormat;
      this.writeValue(value);
    }
  }

  public valueHours: string;
  public valueMinutes: string;
  public amPm: 'am' | 'pm';
  public hoursFocused = false;
  public minutesFocused = false;
  public buttonsFocused = false;
  public timeFormat: TimeFormat = TimeFormat.Time24;

  readonly autoComplete = InputAutoCompleteOptions;
  readonly iconColor = IconColor;
  readonly clearIcn: Icon = ICON_CONFIG.reset;
  readonly timeIcn: Icon = {
    icon: Icons.timeline,
    size: IconSize.medium,
  };
  readonly timeFormats = TimeFormat;

  private parseConfig = BTP_PARSE_CONFIG_BY_TIMEFORMAT[TimeFormat.Time24];

  @HostListener('click.outside-zone', ['$event'])
  onHostClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.matches('.bfe-input-button.am')) {
      this.setAmPm('am');
    }
    if (target.matches('.bfe-input-button.pm')) {
      this.setAmPm('pm');
    }
    if (target.matches('.clear-input')) {
      this.clearInput();
    }
    if (target.matches('input')) {
      (target as HTMLInputElement).select();
    }
    if (target.matches('button')) {
      this.buttonsFocused = true;
      this.cd.detectChanges();
    }
    if (target?.matches('.bfe-prefix,.bfe-suffix')) {
      event.preventDefault();
    }
    if (target.matches('.bfe-prefix')) {
      this.inputHours.nativeElement.focus();
    }
    if (target.matches('.bfe-suffix')) {
      this.inputMinutes.nativeElement.focus();
    }
  }

  @HostListener('focusout.outside-zone', ['$event'])
  onHostFocusOut(event: FocusEvent) {
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (relatedTarget?.matches('.bfe-prefix,.bfe-suffix')) {
      event.preventDefault();
    }
    if (target === this.inputHours.nativeElement) {
      this.onHoursBlur(event);
    }
    if (target === this.inputMinutes.nativeElement) {
      this.onMinutesBlur(event);
    }
    if (
      !relatedTarget ||
      !this.hostElRef.nativeElement.contains(relatedTarget)
    ) {
      this.hoursFocused = this.minutesFocused = this.buttonsFocused = false;
      this.cd.detectChanges();
    }
  }

  public onInputKeydown(event: KeyboardEvent) {
    if (!this.kbrdCntrlSrvc.filterAllowedKeys(event, /[0-9]/)) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const keyAsNumber = parseInt(event.key, 10);
    const cursorPos = input.selectionStart;
    const valAsNumber = [
      parseInt(input.value[0], 10),
      parseInt(input.value[1], 10),
    ];
    if (
      input === this.inputHours.nativeElement &&
      ((this.timeFormat === TimeFormat.Time12 &&
        ((valAsNumber[0] === 1 && cursorPos > 0 && keyAsNumber > 2) ||
          (valAsNumber[0] > 1 && !isNaN(keyAsNumber)))) ||
        (this.timeFormat === TimeFormat.Time24 &&
          ((valAsNumber[0] === 2 && cursorPos > 0 && keyAsNumber > 3) ||
            (valAsNumber[0] > 2 && cursorPos > 0 && !isNaN(keyAsNumber)))))
    ) {
      event.preventDefault();
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
          { ...this.parseConfig.hours, mod: 1 }
        );
        if (
          this.inputHours.nativeElement.value ===
          this.parseConfig.hours.maxValue
        ) {
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
          { ...this.parseConfig.minutes, mod: 5, round: 5 }
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
          { ...this.parseConfig.hours, mod: -1 }
        );
        this.inputHours.nativeElement.setSelectionRange(2, 2);
        this.zone.run(() => {
          this.transmit(InputEventType.onChange);
        });
      }
      if (this.minutesFocused) {
        this.inputMinutes.nativeElement.value = this.valueMinutes = this.parseValue(
          this.inputMinutes.nativeElement.value,
          { ...this.parseConfig.minutes, mod: -5, round: 5 }
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

  public setAmPm(val: 'am' | 'pm'): void {
    if (val !== this.amPm) {
      this.amPm = val;
      this.cd.detectChanges();
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange],
      });
    }
  }

  public onHoursChange(event) {
    if (event.target.value.length > 1) {
      this.inputMinutes.nativeElement.focus();
    }
  }

  public onMinutesChange(event) {
    if (event.target.value.length > 1) {
      this.inputMinutes.nativeElement.blur();
    }
  }

  public onHoursFocus() {
    this.hoursFocused = true;
    this.minutesFocused = this.buttonsFocused = false;
    this.cd.detectChanges();
    this.inputHours.nativeElement.select();
  }

  public onMinutesFocus() {
    this.minutesFocused = true;
    this.hoursFocused = this.buttonsFocused = false;
    this.inputMinutes.nativeElement.select();
    this.cd.detectChanges();
  }

  public onHoursBlur(event: FocusEvent) {
    this.hoursFocused = false;
    this.inputHours.nativeElement.value = this.valueHours = this.parseValue(
      (event.target as HTMLInputElement).value,
      { ...this.parseConfig.hours, def: '' }
    );
    if (this.timeFormat === TimeFormat.Time12 && !this.amPm) {
      this.amPm = 'am';
    }
    this.cd.detectChanges();
    this.transmit(InputEventType.onBlur);
  }

  public onMinutesBlur(event: FocusEvent) {
    this.minutesFocused = false;
    this.inputMinutes.nativeElement.value = this.valueMinutes = this.parseValue(
      (event.target as HTMLInputElement).value,
      { ...this.parseConfig.minutes, def: '' }
    );
    if (this.timeFormat === TimeFormat.Time12 && !this.amPm) {
      this.amPm = 'am';
    }
    this.cd.detectChanges();
    this.transmit(InputEventType.onBlur);
  }

  public isInputEmpty() {
    return !(
      (this.valueHours && this.valueHours !== '00') ||
      (this.valueMinutes && this.valueMinutes !== '00')
    );
  }

  public clearInput() {
    this.value = this.valueMinutes = this.valueHours = this.amPm = null;
    this.cd.detectChanges();
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
    return isString(value)
      ? this.parseValue(
          value.split(/\D/).filter(Boolean)[index],
          index === 0
            ? { ...this.parseConfig.hours, def: '' }
            : { ...this.parseConfig.minutes, def: '' }
        )
      : undefined;
  }

  private combineValue(valueHours: string, valueMinutes: string): string {
    return (valueHours === '' || isNullOrUndefined(valueHours)) &&
      (valueMinutes === '' || isNullOrUndefined(valueMinutes))
      ? null
      : `${valueHours || '00'}:${valueMinutes || '00'}`;
  }

  private adjustToFormat(
    time: string,
    sourceFormat: TimeFormat = TimeFormat.Time24,
    targetFormat: TimeFormat = TimeFormat.Time24,
    amPm?: 'am' | 'pm'
  ): { time: string; amPm: 'am' | 'pm' } {
    if (!time) {
      return { time, amPm };
    }
    const split = time
      .split(/\D/)
      .filter(Boolean)
      .map((v) => parseInt(v, 10));

    // 24h > 12h
    if (
      sourceFormat === TimeFormat.Time24 &&
      targetFormat === TimeFormat.Time12
    ) {
      amPm = split[0] === 0 || split[0] > 12 ? 'pm' : 'am';
      split[0] = ((split[0] + 11) % 12) + 1;
    }

    // 12h > 24h
    if (
      sourceFormat === TimeFormat.Time12 &&
      targetFormat === TimeFormat.Time24
    ) {
      // split[0] === 12 && (split[0] = 0);
      amPm === 'pm' && (split[0] = split[0] + 12);
    }

    if (split[0] > 23) {
      amPm = split[0] > 24 ? 'am' : 'pm';
      split[0] = split[0] - (targetFormat === TimeFormat.Time24 ? 24 : 12);
    }

    return {
      time: split.map((v) => padWith0(v, 2)).join(':'),
      amPm,
    };
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
