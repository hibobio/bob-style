import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
} from '@angular/core';
import { DateParseService } from '../date-parse-service/date-parse.service';
import {
  applyChanges,
  hasChanges,
  isNullOrUndefined,
} from '../../../services/utils/functional-utils';
import { DateParseResult, FormatParserResult } from '../datepicker.interface';
import { DOMInputEvent, DateFormatFullDate } from '../../../types';
import { DISPLAY_DATE_FORMAT_DEF } from '../../../consts';
import { DateAdjust } from '../datepicker.enum';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isSameDay from 'date-fns/isSameDay';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import toDate from 'date-fns/toDate';

@Directive({
  selector: '[bDateInput]',
})
export class DateInputDirective implements OnChanges, OnInit {
  constructor(
    private inputRef: ElementRef,
    private parseService: DateParseService
  ) {
    this.input = inputRef.nativeElement;

    if (this.input.nodeName !== 'INPUT') {
      throw new Error(`This directive should only be used on <input> element`);
    }
  }

  private input: HTMLInputElement;
  private format: FormatParserResult;
  private lastDate: Date;

  @Input('bDateInput')
  dateFormat:
    | FormatParserResult
    | DateFormatFullDate
    | string = DISPLAY_DATE_FORMAT_DEF;
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;
  @Input() setTo: DateAdjust;

  @Output() parsed: EventEmitter<DateParseResult> = new EventEmitter<
    DateParseResult
  >();

  @HostListener('change', ['$event']) onChange($event: DOMInputEvent): void {
    this.process();
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        dateFormat: DISPLAY_DATE_FORMAT_DEF,
        date: null,
      },
      [],
      true
    );

    if (hasChanges(changes, ['dateFormat'], true)) {
      this.format = this.parseService.parseFormat(this.dateFormat as string, 4);

      this.process(!isNullOrUndefined(this.date), true);
    }

    if (hasChanges(changes, ['date'])) {
      this.process(true);
    }

    if (hasChanges(changes, ['min', 'max'], true)) {
      if (
        this.input.value &&
        (!this.date || !this.dateConformsMinMax(this.date))
      ) {
        this.process(!isNullOrUndefined(this.date), true);
      }
    }
  }

  ngOnInit(): void {
    if (!this.format && this.dateFormat) {
      this.format = this.parseService.parseFormat(this.dateFormat as string, 4);
    }
  }

  process(useDate = false, force = false): void {
    if (
      (!useDate && !this.input.value) ||
      (useDate &&
        ((!this.date && !this.lastDate) ||
          (!force && isSameDay(this.date, this.lastDate))))
    ) {
      return;
    }

    let parsed: DateParseResult = {
      valid: false,
      format: this.format ? this.format.format : null,
      date: null,
      value: null,
    };

    if (useDate) {
      parsed.date = this.date || null;
      parsed.value = this.parseService.getDisplayDate(this.format, parsed.date);
      parsed.valid = Boolean(parsed.value);
    } else if (this.input.value) {
      parsed = this.parseService.parseDate(
        (this.format || this.dateFormat) as any,
        this.input.value
      );
    }

    if (!this.dateConformsMinMax(parsed.date)) {
      parsed.valid = false;
      parsed.value = null;
      parsed.date = null;
    }

    this.lastDate = this.date = parsed.date;

    this.input.value = parsed.value;

    parsed.date = this.getAdjustedDate(parsed.date);

    this.parsed.emit(parsed);
  }

  private getAdjustedDate(date: Date): Date {
    return !date
      ? null
      : this.setTo === DateAdjust.startOfMonth
      ? startOfMonth(date)
      : this.setTo === DateAdjust.endOfMonth
      ? endOfMonth(date)
      : toDate(date);
  }

  private dateConformsMinMax(date: Date): boolean {
    if (
      !this.format.onlyMonth &&
      (isBefore(date, this.min) || isAfter(date, this.max))
    ) {
      return false;
    }

    if (
      this.format.onlyMonth &&
      (isBefore(startOfMonth(date), startOfMonth(this.min)) ||
        isAfter(endOfMonth(date), endOfMonth(this.max)))
    ) {
      return false;
    }

    return true;
  }
}
