import { ColorsGrey } from './services/color-service/color-palette.enum';
import { DateLocaleFormats } from './types';

export enum ComponentGroupType {
  Avatar = 'Avatar',
  Buttons = 'Buttons',
  Cards = 'Cards',
  Charts = 'Charts',
  Chips = 'Chips',
  Comments = 'Comments',
  EyeCandy = 'Eye Candy',
  FormElements = 'Form Elements',
  HtmlCss = 'HTML-CSS',
  Icons = 'Icons',
  Indicators = 'Indicators',
  Layout = 'Layout',
  Lists = 'Lists',
  Misc = 'Misc',
  Navigation = 'Navigation',
  Popups = 'Popups',
  Search = 'Search',
  Services = 'Services',
  Tables = 'Tables',
  Templates = 'Templates',
  Tooltip = 'Tooltip',
  Typography = 'Typography',
  Widgets = 'Widgets',
}

export const mobileBreakpoint = 768;

export const SERVER_DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Min length of search string, max distance between letters
 */
export const FUZZY_SRCH_CONFIG = [4, 5];

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
  'YYYY-MM-DD': {
    DayMonth: 'MM-dd',
    MonthYear: 'yy-MM',
    FullDate: 'yyyy-MM-dd',
    ShortDate: 'yy-MM-d',
  },
  'DD.MM.YYYY': {
    DayMonth: 'dd.MM',
    MonthYear: 'MM.yy',
    FullDate: 'dd.MM.yyyy',
    ShortDate: 'dd.M.yy',
  },
  'MM.DD.YYYY': {
    DayMonth: 'MM.dd',
    MonthYear: 'MM.yy',
    FullDate: 'MM.dd.yyyy',
    ShortDate: 'M.dd.yy',
  },
  'YYYY.MM.DD': {
    DayMonth: 'MM.dd',
    MonthYear: 'yy.MM',
    FullDate: 'yyyy.MM.dd',
    ShortDate: 'yy.MM.d',
  },
};

export const DISPLAY_DATE_FORMAT_DEF = LOCALE_FORMATS['DD/MM/YYYY'].FullDate;

export const DISPLAY_MONTH_FORMAT_DEF = LOCALE_FORMATS['DD/MM/YYYY'].MonthYear;

export const COLOR_GREY_100 = ColorsGrey.grey_100;
export const COLOR_GREY_200 = ColorsGrey.grey_200;
export const COLOR_GREY_300 = ColorsGrey.grey_300;
export const COLOR_GREY_400 = ColorsGrey.grey_400;
export const COLOR_GREY_500 = ColorsGrey.grey_500;
export const COLOR_GREY_600 = ColorsGrey.grey_600;
export const COLOR_GREY_700 = ColorsGrey.grey_700;
export const COLOR_GREY_800 = ColorsGrey.grey_800;
export const COLOR_GREY_900 = ColorsGrey.grey_900;

export const emptyPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const INVISIBLE_CHARACTER = '\u200E';
export const NBSP_CHARACTER = '\u00A0';

export const EMAIL_VALIDATION_REGEX = /^\s*[\w.\-\+]+@[\w.\-]+\.[\w]{2,8}\s*$/;
