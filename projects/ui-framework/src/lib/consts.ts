import { DateLocaleFormats } from './types';

export enum ComponentGroupType {
  Buttons = 'Components|Buttons',
  Indicators = 'Components|Indicators',
  Avatar = 'Components|Avatar',
  FormElements = 'Components|Form Elements',
  Comments = 'Components|Comments',
  Cards = 'Components|Cards',
  Charts = 'Components|Charts',
  Chips = 'Components|Chips',
  Tables = 'Components|Tables',
  Popups = 'Components|Popups',
  Tooltip = 'Components|Tooltip',
  Layout = 'Components|Layout',
  Misc = 'Components|Misc',
  Navigation = 'Components|Navigation',
  Search = 'Components|Search',
  Lists = 'Components|Lists',
  Icons = 'Icons',
  Typography = 'Typography',
  Services = 'Services',
  EyeCandy = 'Eye Candy',
  HtmlCss = 'HTML-CSS',
}

export const mobileBreakpoint = 768;

export const SERVER_DATE_FORMAT = 'yyyy-MM-dd';

export const LOCALE_FORMATS: DateLocaleFormats = {
  'DD/MM/YYYY': {
    DayMonth: 'dd/MM',
    MonthYear: 'MM/yy',
    FullDate: 'dd/MM/yyyy',
    ShortDate: 'dd/MM/yy',
  },
  'MM/DD/YYYY': {
    DayMonth: 'MM/dd',
    MonthYear: 'MM/yy',
    FullDate: 'MM/dd/yyyy',
    ShortDate: 'M/dd/yy',
  },
  'DD/MMM/YYYY': {
    DayMonth: 'dd/MMM',
    MonthYear: 'MMM/yy',
    FullDate: 'dd/MMM/yyyy',
    ShortDate: 'dd/MMM/yy',
  },
  'MMM/DD/YYYY': {
    DayMonth: 'MMM/dd',
    MonthYear: 'MMM/yy',
    FullDate: 'MMM/dd/yyyy',
    ShortDate: 'MMM/d/yy',
  },
  'YYYY/MM/DD': {
    DayMonth: 'MM/dd',
    MonthYear: 'yy/MM',
    FullDate: 'yyyy/MM/dd',
    ShortDate: 'yy/MM/d',
  },
  'DD-MM-YYYY': {
    DayMonth: 'dd-MM',
    MonthYear: 'MM-yy',
    FullDate: 'dd-MM-yyyy',
    ShortDate: 'dd-M-yy',
  },
  'MM-DD-YYYY': {
    DayMonth: 'MM-dd',
    MonthYear: 'MM-yy',
    FullDate: 'MM-dd-yyyy',
    ShortDate: 'M-dd-yy',
  },
  'DD-MMM-YYYY': {
    DayMonth: 'dd-MMM',
    MonthYear: 'MMM-yy',
    FullDate: 'dd-MMM-yyyy',
    ShortDate: 'dd-MMM-yy',
  },
  'MMM-DD-YYYY': {
    DayMonth: 'MMM-dd',
    MonthYear: 'MMM-yy',
    FullDate: 'MMM-dd-yyyy',
    ShortDate: 'MMM-d-yy',
  },
};

export const DISPLAY_DATE_FORMAT_DEF = LOCALE_FORMATS['DD/MM/YYYY'].FullDate;

export const DISPLAY_MONTH_FORMAT_DEF = LOCALE_FORMATS['DD/MM/YYYY'].MonthYear;

export const COLOR_GREY_100 = '#f8f7f7';
export const COLOR_GREY_200 = '#f3f2f2';
export const COLOR_GREY_300 = '#e9e9e9';
export const COLOR_GREY_400 = '#e2e2e2';
export const COLOR_GREY_500 = '#d2d2d2';
export const COLOR_GREY_600 = '#9d9d9d';
export const COLOR_GREY_700 = '#535353';
export const COLOR_GREY_800 = '#303030';
export const COLOR_GREY_900 = '#050505';
