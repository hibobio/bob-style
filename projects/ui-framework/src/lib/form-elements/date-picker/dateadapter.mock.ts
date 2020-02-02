import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { LocaleFormat, DateLocaleFormatKeys, DateFormat } from '../../types';
import {
  LOCALE_FORMATS,
  DISPLAY_DATE_FORMAT_DEF,
  DISPLAY_MONTH_FORMAT_DEF,
} from '../../consts';
import { get } from 'lodash';
import { format, parseISO } from 'date-fns';
import { DateParseService } from './date-parse-service/date-parse.service';
import { FormatParserResult } from './datepicker.interface';

const mockUser: {
  dateFormat: DateLocaleFormatKeys;
} = {
  dateFormat: 'DD-MMM-YYYY',
};

export const UserLocaleServiceMock = {
  dateFormat: mockUser.dateFormat.toUpperCase(),

  getDateFormat() {
    return UserLocaleServiceMock.dateFormat;
  },

  getDisplayDate(date, localeFormat) {
    let dateToFormat = date;

    const dateFormat = get(
      get(LOCALE_FORMATS, UserLocaleServiceMock.dateFormat),
      localeFormat
    );

    if (dateFormat === undefined) {
      throw new Error(
        `${
          UserLocaleServiceMock.dateFormat
        } is not a valid User Locale date format.`
      );
    }

    return format(
      typeof dateToFormat === 'string' ? parseISO(dateToFormat) : dateToFormat,
      dateFormat
    );
  },
};

@Injectable({
  providedIn: 'root',
})
export class BDateAdapterMock extends NativeDateAdapter {
  public static readonly formatMonthYearLabel = 'MMM yyyy';

  public static readonly formatFullDate: FormatParserResult = DateParseService.prototype.parseFormat(
    get(
      get(LOCALE_FORMATS, UserLocaleServiceMock.dateFormat),
      LocaleFormat.FullDate
    ) || DISPLAY_DATE_FORMAT_DEF
  );

  public static readonly formatMonthYear: FormatParserResult = DateParseService.prototype.parseFormat(
    get(
      get(LOCALE_FORMATS, UserLocaleServiceMock.dateFormat),
      LocaleFormat.MonthYear
    ) || DISPLAY_MONTH_FORMAT_DEF
  );

  getFormat(
    displayFormat: LocaleFormat = LocaleFormat.FullDate
  ): FormatParserResult {
    switch (displayFormat) {
      case LocaleFormat.MonthYear:
        return BDateAdapterMock.formatMonthYear;
      default:
        return BDateAdapterMock.formatFullDate;
    }
  }

  getLocaleFormat(key: DateLocaleFormatKeys, frmt: LocaleFormat): DateFormat {
    return get(get(LOCALE_FORMATS, key.toUpperCase()), frmt);
  }

  parse(value: any): Date | null {
    return DateParseService.prototype.parseDate(
      BDateAdapterMock.formatFullDate,
      value
    ).date;
  }

  format(date: Date, displayFormat: any): string {
    switch (displayFormat) {
      case 'input':
        return UserLocaleServiceMock.getDisplayDate(
          date,
          LocaleFormat.FullDate
        );
      case 'inputMonth':
        return UserLocaleServiceMock.getDisplayDate(
          date,
          LocaleFormat.MonthYear
        );
      case 'monthYearLabel':
        return format(date, BDateAdapterMock.formatMonthYearLabel);
      default:
        return date.toDateString();
    }
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}

export const B_DATE_FORMATS = {
  parse: {},
  display: {
    dateInput: 'input',
    monthYearLabel: 'monthYearLabel',

    dateA11yLabel: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    monthYearA11yLabel: { month: 'short', year: 'numeric' },
  },
};
