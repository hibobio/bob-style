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

export const COLOR_1_BASE = '#d36565';
export const COLOR_1_DARK = '#a54d4d';
export const COLOR_1_DARKER = '#812525';
export const COLOR_1_LIGHT = '#f09292';
export const COLOR_1_LIGHTER = '#f6bbbb';

export const COLOR_2_BASE = '#e8d883';
export const COLOR_2_DARK = '#c1b051';
export const COLOR_2_DARKER = '#776926';
export const COLOR_2_LIGHT = '#f8eaa3';
export const COLOR_2_LIGHTER = '#fbf5d7';

export const COLOR_3_BASE = '#f1a168';
export const COLOR_3_DARK = '#eb7a29';
export const COLOR_3_DARKER = '#a84f10';
export const COLOR_3_LIGHT = '#f4b486';
export const COLOR_3_LIGHTER = '#ffdbc1';

export const COLOR_4_BASE = '#c85c8a';
export const COLOR_4_DARK = '#9b446a';
export const COLOR_4_DARKER = '#642b44';
export const COLOR_4_LIGHT = '#feabcf';
export const COLOR_4_LIGHTER = '#ffcce2';

export const COLOR_5_BASE = '#6cc1c1';
export const COLOR_5_DARK = '#46919e';
export const COLOR_5_DARKER = '#154156';
export const COLOR_5_LIGHT = '#a8ded7';
export const COLOR_5_LIGHTER = '#ceefe9';

export const COLOR_6_BASE = '#9368bf';
export const COLOR_6_DARK = '#6b4493';
export const COLOR_6_DARKER = '#4b2f67';
export const COLOR_6_LIGHT = '#c9aae8';
export const COLOR_6_LIGHTER = '#e6d3f9';

export const COLOR_7_BASE = '#85c88a';
export const COLOR_7_DARK = '#589c5c';
export const COLOR_7_DARKER = '#38613a';
export const COLOR_7_LIGHT = '#a9e8ad';
export const COLOR_7_LIGHTER = '#d3f8d6';

export const COLOR_8_BASE = '#b48e78';
export const COLOR_8_DARK = '#8b6c59';
export const COLOR_8_DARKER = '#593e2d';
export const COLOR_8_LIGHT = '#e0b69c';
export const COLOR_8_LIGHTER = '#f8d5c0';

export const COLOR_9_BASE = '#a4c9ef';
export const COLOR_9_DARK = '#618cbb';
export const COLOR_9_DARKER = '#2e4d6e';
export const COLOR_9_LIGHT = '#bed8f5';
export const COLOR_9_LIGHTER = '#deedfd';

export const INVISIBLE_CHAR = '‌‌ ';
