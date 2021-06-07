import { asArray, isDark, isString } from './functional-utils';

type LoggerActions =
  | 'message'
  | 'info'
  | 'dir'
  | 'success'
  | 'warning'
  | 'attention'
  | 'error';

const LOGGER_DATA: Record<
  LoggerActions,
  [method: string, color: string, txtIcon: string, fontSize: string]
> = {
  message: ['log', '#535353', '•', '13px'],
  info: ['info', '#4b95ec', 'ℹ', '12px'],
  dir: ['dir', '#4b95ec', 'ℹ', '12px'],
  success: ['log', '#0d853d', '✔', '13px'],
  warning: ['warn', '#ff8100', '⚠', '13px'],
  attention: ['log', '#ff8100', '⚑', '13px'],
  error: ['error', '#cc2748', '✗', '13px'],
};

const LOGGER_TXTCOL_DEF = 'white';

type LoggerArgs = [
  things: string | (string | unknown)[],
  tag?: string,
  bgColor?: string,
  textColor?: string
];

// tslint:disable-next-line: class-name
export class log {
  constructor(tag: string, bgColor?: string) {
    this._tag = tag;
    this._bgColor = bgColor;
    this._textColor = bgColor && isDark(bgColor) ? 'white' : 'black';
  }

  private readonly _tag: string;
  private readonly _bgColor: string;
  private readonly _textColor: string;

  private static getErrror(
    thingsIn: any[]
  ): {
    things: (string | unknown)[];
    error: Error;
    errorTxt: string;
  } {
    let errorTxt: string;
    const things = thingsIn.slice();

    const errorIdx = thingsIn.findIndex(
      (th) => th instanceof Error || (th?.stack && th?.message)
    );

    if (errorIdx > -1) {
      errorTxt = `${thingsIn[errorIdx].name}: ${thingsIn[errorIdx].message}`;
      things[errorIdx] = errorTxt;
    }

    return {
      error: thingsIn[errorIdx],
      errorTxt,
      things,
    };
  }

  private static do(
    what: LoggerActions = 'message',
    thingsIn: string | (string | unknown)[],
    tag: string = null,
    bgColor: string = null,
    textColor: string = null
  ) {
    const { things } = log.getErrror(asArray(thingsIn));

    const addToTag =
      things.length > 1 && isString(things[0]) && things[0].length < 20;

    bgColor = bgColor || LOGGER_DATA[what][1];
    textColor =
      textColor ||
      (bgColor ? (isDark(bgColor) ? 'white' : 'black') : LOGGER_TXTCOL_DEF);

    const method = LOGGER_DATA[what][0];

    tag
      ? console[method](
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
      : console[method](...things);
  }

  static me(...args: LoggerArgs) {
    this.do('message', ...args);
  }
  static inf(...args: LoggerArgs) {
    this.do('info', ...args);
  }
  static dir(...args: LoggerArgs) {
    this.do('dir', ...args);
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

  message(...things: (string | unknown)[]) {
    log.me(things, this._tag, this._bgColor, this._textColor);
  }
  info(...things: (string | unknown)[]) {
    log.inf(things, this._tag, this._bgColor, this._textColor);
  }
  success(...things: (string | unknown)[]) {
    log.scs(things, this._tag, this._bgColor, this._textColor);
  }
  warning(...things: (string | unknown)[]) {
    log.wrn(things, this._tag, this._bgColor, this._textColor);
  }
  attention(...things: (string | unknown)[]) {
    log.atn(things, this._tag, this._bgColor, this._textColor);
  }
  error(...things: (string | unknown)[]) {
    log.err(things, this._tag, this._bgColor, this._textColor);
  }
  clear() {
    log.clr();
  }
}
