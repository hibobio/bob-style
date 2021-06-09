import { Keys, Sort } from './enums';
import {
  ColorPalette,
  ColorsGrey,
  ColorsMain,
} from './services/color-service/color-palette.enum';

export interface GenericObject<T = any> {
  [key: string]: T;
}

// export type PxSize<S extends string = string> = `${S}px`;
export type PxSize = string;

// export type HexColor<H extends string = string> = `#${H}`;
export type HexColor = string;

export type Color = ColorPalette | ColorsMain | ColorsGrey | HexColor;

export type SortType = Sort | 'asc' | 'desc' | boolean;

export type Timer = NodeJS.Timer | number;
export interface ArrayES<T = any> extends Array<T> {
  flat(): Array<T>;
  flatMap(func: (x: T) => T): Array<T>;
}

export interface RegExpWrapper extends Pick<RegExp, 'exec' | 'test'> {
  regExp: RegExp;
}
export interface OverlayPositionClasses {
  'panel-below'?: boolean;
  'panel-above'?: boolean;
  'panel-after'?: boolean;
  'panel-before'?: boolean;
}

export interface DOMInputElement
  extends HTMLInputElement,
    Omit<
      HTMLTextAreaElement,
      'addEventListener' | 'removeEventListener' | 'type'
    > {}
export interface DOMEventTarget
  extends EventTarget,
    Omit<
      Extract<HTMLInputElement, EventTarget> &
        Extract<HTMLButtonElement, EventTarget> &
        Extract<HTMLElement, EventTarget>,
      'addEventListener' | 'removeEventListener' | 'dispatchEvent'
    > {}

export interface DOMMouseEvent<
  T extends EventTarget = DOMEventTarget,
  R extends EventTarget = DOMEventTarget
> extends Omit<MouseEvent, 'target' | 'relatedTarget'> {
  readonly target: T;
  readonly relatedTarget?: R | null;
}
export interface DOMKeyboardEvent<T extends EventTarget = DOMEventTarget>
  extends Omit<KeyboardEvent, 'target'> {
  readonly target: T;
  key: Keys | string;
}

export interface DOMFocusEvent<
  T extends EventTarget = DOMEventTarget,
  R extends EventTarget = DOMEventTarget
> extends Omit<FocusEvent, 'target' | 'relatedTarget'> {
  readonly target: T;
  readonly relatedTarget: R | null;
}

export interface DOMInputEvent extends UIEvent {
  readonly data: string | null;
  readonly isComposing: boolean;
  readonly dataTransfer: DataTransfer;
  readonly inputType: string;
  readonly target: DOMInputElement;
}

export interface DOMAnyEvent
  extends Omit<
    Event &
      Partial<DOMMouseEvent & DOMKeyboardEvent & DOMFocusEvent & DOMInputEvent>,
    'target' | 'key' | 'relatedTarget'
  > {
  key?: Keys | string;
  target: DOMEventTarget;
  relatedTarget?: DOMEventTarget;
}

export interface DOMSomeEvent
  extends Omit<
    DOMMouseEvent & DOMKeyboardEvent & DOMFocusEvent & DOMInputEvent,
    'target' | 'key' | 'relatedTarget'
  > {
  key: Keys | string;
  target: DOMEventTarget;
  relatedTarget: DOMEventTarget;
}

export type DOMeventID<
  E extends Partial<
    Event & MouseEvent & KeyboardEvent & FocusEvent & InputEvent
  >
> = E extends MouseEvent
  ? DOMMouseEvent
  : E extends DOMMouseEvent
  ? DOMMouseEvent
  : E extends KeyboardEvent
  ? DOMKeyboardEvent
  : E extends DOMKeyboardEvent
  ? DOMKeyboardEvent
  : E extends InputEvent
  ? DOMInputEvent
  : E extends DOMInputEvent
  ? DOMInputEvent
  : E extends FocusEvent
  ? DOMFocusEvent
  : E extends DOMFocusEvent
  ? DOMFocusEvent
  : E extends Event
  ? DOMAnyEvent
  : DOMAnyEvent;

export type MouseOrKeyboardEvent =
  | KeyboardEvent
  | DOMKeyboardEvent
  | MouseEvent
  | DOMMouseEvent;

// LOCALE DATES

export enum TimeFormat {
  Time12 = '12h',
  Time24 = '24h',
}

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
