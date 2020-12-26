import { ColorService } from '../color-service/color.service';
import { asArray, isString } from './functional-utils';

const LOGGER_DATA = {
  message: ['log', '#535353', '•', '13px'],
  info: ['info', '#4b95ec', 'ℹ', '12px'],
  success: ['log', '#0d853d', '✔', '13px'],
  warning: ['warn', '#ff8100', '⚠', '13px'],
  attention: ['log', '#ff8100', '⚑', '13px'],
  error: ['error', '#cc2748', '✗', '13px'],
};

const LOGGER_TXTCOL_DEF = 'white';

type LoggerActions = keyof typeof LOGGER_DATA;
type LoggerArgs = [any | any[], string?, string?, string?];

// tslint:disable-next-line: class-name
export class log {
  constructor(tag: string, bgColor?: string) {
    this._tag = tag;
    this._bgColor = bgColor;
    this._textColor =
      bgColor && ColorService.prototype.isDark(bgColor) ? 'white' : 'black';
  }

  private readonly _tag: string;
  private readonly _bgColor: string;
  private readonly _textColor: string;

  private static do(
    what: LoggerActions = 'message',
    things: any | any[],
    tag: string = null,
    bgColor: string = null,
    textColor: string = null
  ) {
    things = asArray(things);

    const addToTag =
      things.length > 1 && isString(things[0]) && things[0].length < 20;

    bgColor = bgColor || LOGGER_DATA[what][1];
    textColor =
      textColor ||
      (bgColor
        ? ColorService.prototype.isDark(bgColor)
          ? 'white'
          : 'black'
        : LOGGER_TXTCOL_DEF);

    return tag
      ? console[LOGGER_DATA[what][0]](
          `%c${LOGGER_DATA[what][2]}%c[${tag}]:${
            addToTag ? ` ${things[0]}` : ''
          }`,
          `color: ${LOGGER_DATA[what][1]};
            padding: 0 3px 0 0;
            font-size: ${LOGGER_DATA[what][3]};
            line-height: 12px;`,
          `background: ${bgColor};
            color: ${textColor};
            padding: 0 3px 0 2px;
            font-size: 9px;
            line-height: 12px;`,
          ...(addToTag ? things.slice(1) : things)
        )
      : console[LOGGER_DATA[what][0]](...things);
  }

  static me(...args: LoggerArgs) {
    this.do('message', ...args);
  }
  static inf(...args: LoggerArgs) {
    this.do('info', ...args);
  }
  static scs(...args: LoggerArgs) {
    this.do('success', ...args);
  }
  static wrn(...args: LoggerArgs) {
    this.do('warning', ...args);
  }
  static atn(...args: LoggerArgs) {
    this.do('attention', ...args);
  }
  static err(...args: LoggerArgs) {
    this.do('error', ...args);
  }
  static clr() {
    console.clear();
  }

  static logger(tag: string, bgColor?: string) {
    return new log(tag, bgColor);
  }

  message(...things: any[]) {
    log.me(things, this._tag, this._bgColor, this._textColor);
  }
  info(...things: any[]) {
    log.inf(things, this._tag, this._bgColor, this._textColor);
  }
  success(...things: any[]) {
    log.scs(things, this._tag, this._bgColor, this._textColor);
  }
  warning(...things: any[]) {
    log.wrn(things, this._tag, this._bgColor, this._textColor);
  }
  attention(...things: any[]) {
    log.atn(things, this._tag, this._bgColor, this._textColor);
  }
  error(...things: any[]) {
    log.err(things, this._tag, this._bgColor, this._textColor);
  }
  clear() {
    log.clr();
  }
}
