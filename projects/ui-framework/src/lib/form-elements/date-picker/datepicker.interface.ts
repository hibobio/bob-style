import { DateFormat, LocaleFormat, DateLocaleFormatKeys } from '../../types';
import { InputEvent } from '../input/input.interface';

export interface DateRangePickerValue {
  from: string;
  to: string;
}
export interface DateRangePickerValueLocal<D = Date | string>
  extends Partial<DateRangePickerValue> {
  startDate: D;
  endDate: D;
}

export interface DatePickerChangeEvent extends InputEvent<string> {
  date: Date;
}
export interface DateRangePickerChangeEvent
  extends InputEvent<DateRangePickerValue> {
  date: DateRangePickerValueLocal<string>;
}

export type DateFormatKeys = 'day' | 'month' | 'year';

export interface FormatParserResult {
  format: DateFormat;
  valid: boolean;
  items: number;
  separator: string;
  onlyMonth: boolean;

  index: {
    day: number;
    month: number;
    year: number;
  };

  order: DateFormatKeys[];

  length: {
    day: number;
    month: number;
    year: number;
  };
}

export interface DateParseResult {
  valid: boolean;
  format: DateFormat;
  value: string;
  date: Date;
}

export interface BDateAdapter {
  getFormat: (displayFormat: LocaleFormat) => FormatParserResult;
  getLocaleFormat: (
    key: DateLocaleFormatKeys,
    frmt: LocaleFormat
  ) => DateFormat;
  parse: (value: any) => Date | null;
  format: (date: Date, displayFormat: string) => string;
  getFirstDayOfWeek: () => number;
}
