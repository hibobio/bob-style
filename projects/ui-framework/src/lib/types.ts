import { Sort } from './enums';
import {
  ColorPalette,
  ColorsGrey,
} from './services/color-service/color-palette.enum';

export interface GenericObject<T = any> {
  [key: string]: T;
}

export type Color = ColorPalette | ColorsGrey | string;

export type SortType = Sort | 'asc' | 'desc' | boolean;

export interface ArrayES<T = any> extends Array<T> {
  flat(): Array<T>;
  flatMap(func: (x: T) => T): Array<T>;
}

export interface OverlayPositionClasses {
  'panel-below'?: boolean;
  'panel-above'?: boolean;
  'panel-after'?: boolean;
  'panel-before'?: boolean;
}

export interface DOMInputEvent extends UIEvent {
  readonly data: string | null;
  readonly isComposing: boolean;
  readonly dataTransfer: DataTransfer;
  readonly inputType: string;
  readonly target: HTMLInputElement;
}

// LOCALE DATES

export type DateFormat =
  | 'dd/MM'
  | 'MM/dd'
  | 'dd/MMM'
  | 'MMM/dd'
  | 'dd-MM'
  | 'MM-dd'
  | 'MMM-dd'
  | 'dd-MMM'
  | 'dd.MM'
  | 'MM.dd'
  | 'MM.dd'
  | 'MM/yy'
  | 'MMM/yy'
  | 'yy/MM'
  | 'MMM-yy'
  | 'MM-yy'
  | 'MM-yyyy'
  | 'MM.yy'
  | 'yy.MM'
  | 'dd/MM/yyyy'
  | 'dd/MM/yy'
  | 'MM/dd/yyyy'
  | 'dd/MMM/yyyy'
  | 'MMM/dd/yyyy'
  | 'yyyy/MM/dd'
  | 'dd-MM-yyyy'
  | 'MM-dd-yyyy'
  | 'dd-MMM-yyyy'
  | 'MMM-dd-yyyy'
  | 'M/dd/yy'
  | 'dd/MMM/yy'
  | 'MMM/d/yy'
  | 'yy/MM/d'
  | 'dd-M-yy'
  | 'M-dd-yy'
  | 'dd-MMM-yy'
  | 'MMM-d-yy'
  | 'MM/yyyy'
  | 'MM-yyyy'
  | 'YYYY/MM/DD'
  | 'yyyy-MM-dd'
  | 'dd.MM.yyyy'
  | 'MM.dd.yyyy'
  | 'yyyy.MM.dd';

export type DateFormatDayMonth =
  | 'dd/MM'
  | 'MM/dd'
  | 'dd/MMM'
  | 'MMM/dd'
  | 'dd-MM'
  | 'MM-dd'
  | 'MMM-dd'
  | 'dd-MMM'
  | 'dd.MM'
  | 'MM.dd'
  | 'MM.dd';
export type DateFormatMonthYear =
  | 'MM/yy'
  | 'MMM/yy'
  | 'yy/MM'
  | 'MMM-yy'
  | 'MM-yy'
  | 'MM/yyyy'
  | 'yy-MM'
  | 'MM-yyyy'
  | 'MM.yy'
  | 'yy.MM';

export type DateFormatFullDate =
  | 'dd/MM/yyyy'
  | 'MM/dd/yyyy'
  | 'dd/MMM/yyyy'
  | 'MMM/dd/yyyy'
  | 'yyyy/MM/dd'
  | 'dd-MM-yyyy'
  | 'MM-dd-yyyy'
  | 'dd-MMM-yyyy'
  | 'MMM-dd-yyyy'
  | 'yyyy-MM-dd'
  | 'dd.MM.yyyy'
  | 'MM.dd.yyyy'
  | 'yyyy.MM.dd';

export type ShortDate =
  | 'dd/MM/yy'
  | 'M/dd/yy'
  | 'dd/MMM/yy'
  | 'MMM/d/yy'
  | 'yy/MM/d'
  | 'dd-M-yy'
  | 'M-dd-yy'
  | 'dd-MMM-yy'
  | 'MMM-d-yy'
  | 'yy-MM-d'
  | 'dd.M.yy'
  | 'M.dd.yy'
  | 'yy.MM.d';

export type DateLocaleFormatKeys =
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'DD/MMM/YYYY'
  | 'MMM/DD/YYYY'
  | 'YYYY/MM/DD'
  | 'DD-MM-YYYY'
  | 'MM-DD-YYYY'
  | 'DD-MMM-YYYY'
  | 'MMM-DD-YYYY'
  | 'YYYY-MM-DD'
  | 'DD.MM.YYYY'
  | 'MM.DD.YYYY'
  | 'YYYY.MM.DD';

export enum LocaleFormat {
  DayMonth = 'DayMonth',
  MonthYear = 'MonthYear',
  FullDate = 'FullDate',
  ShortDate = 'ShortDate',
}

export interface DateLocaleFormat {
  DayMonth: DateFormatDayMonth;
  MonthYear: DateFormatMonthYear;
  FullDate: DateFormatFullDate;
  ShortDate: ShortDate;
}

export type DateLocaleFormats = {
  [key in DateLocaleFormatKeys]: DateLocaleFormat;
};

export type Constructor<T> = new (...args: any[]) => T;
