import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputEventType, InputTypes } from '../input/input.enum';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { invoke } from 'lodash';
import { InputEvent } from '../input/input.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { BaseInputElement } from '../base-input-element';
import { differenceInDays, format, isSameDay, isValid } from 'date-fns';

@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: BDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: B_DATE_FORMATS
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent extends BaseInputElement implements OnInit {
  @Output() dateChange: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();
  @Input() inputLabel: String;
  @Input() dateFormat?: string;

  public readonly calendarIcon: String = Icons.calendar;
  public readonly calendarIconSize: String = IconSize.medium;
  public readonly calendarIconColor: String = IconColor.dark;

  inputTypes = InputTypes;
  @ViewChild('datePickerInput') datePickerInput: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.dateFormat) {
      BDateAdapter.bFormat = this.dateFormat;
    }
  }

  onInputEvents(inputEvent: InputEvent, picker: MatDatepicker<any>): void {
    switch (inputEvent.event) {
      case InputEventType.onBlur:
        if (picker.opened) {
          invoke(this, 'datePickerInput.bInput.nativeElement.focus');
        }
        break;
      case InputEventType.onChange:
        inputEvent.value = isValid(new Date(inputEvent.value))
          ? format(inputEvent.value, serverDateFormat)
          : inputEvent.value;
        this.propagateChange(inputEvent.value);
        this.dateChange.emit(inputEvent);
        break;
      case InputEventType.onFocus:
        picker.open();
        break;
    }
  }

  public dateClass(date: Date): string {
    const today = new Date();
    const diff = differenceInDays(date, today);
    const same = isSameDay(today, date);
    return same ? 'today' : diff < 0 ? 'past' : 'future';
  }

  datePickerClosed() {
    invoke(this, 'datePickerInput.bInput.nativeElement.blur');
  }
}
