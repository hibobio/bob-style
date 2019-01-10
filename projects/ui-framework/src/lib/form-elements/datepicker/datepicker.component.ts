import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MatDatepicker} from '@angular/material';
import {IconColor, Icons, IconSize} from '../../icons';
import * as moment from 'moment';
import {InputEvent, InputEventType, InputTypes} from '../input/input.enum';
import {B_DATE_FORMATS, BDateAdapter} from './date.adapter';


@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: BDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: B_DATE_FORMATS
    }
  ]
})
export class DatepickerComponent implements OnInit {

  @Output() dateChange: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();
  @Input() inputPlaceholder: String;
  @Input() dateFormat?: string;

  public readonly calendarIcon: String = Icons.calendar;
  public readonly calendarIconSize: String = IconSize.small;
  public readonly calendarIconColor: String = IconColor.dark;

  inputTypes = InputTypes;

  constructor() {
  }

  ngOnInit(): void {
    if (this.dateFormat) {
      BDateAdapter.bFormat = this.dateFormat;
    }
  }

  inputEvents(inputEvent: InputEvent, picker: MatDatepicker<any>): void {
    switch (inputEvent.event) {
      case InputEventType.onBlur:
        break;
      case InputEventType.onChange:
        this.dateChange.emit(inputEvent);
        break;
      case InputEventType.onFocus:
        picker.open();
        break;
    }
  }

  public dateClass(d: Date): string {
    const today = moment(new Date());
    const date = moment(d);
    const diff = date.diff(today, 'days');
    const same = date.isSame(today, 'day');
    return same ? 'today' : diff < 0 ? 'past' : 'future';
  }
}
