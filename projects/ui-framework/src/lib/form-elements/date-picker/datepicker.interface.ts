import { DateFormat } from '../../types';

export interface DateRangePickerValue {
  from: string;
  to: string;
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
