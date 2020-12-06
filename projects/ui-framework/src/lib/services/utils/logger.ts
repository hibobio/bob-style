import { asArray, isString } from './functional-utils';

// tslint:disable-next-line: class-name
export class log {
  constructor(tag: string) {
    this._tag = tag;
  }

  private _tag: string;

  private static do(
    what: 'log' | 'info' | 'warn' | 'error' = 'log',
    things: any | any[],
    tag: string = null,
    color = null
  ) {
    things = asArray(things);
    return tag
      ? console[what](
          `%c[${tag}]:${isString(things[0]) ? ` ${things[0]}` : ''}`,
          `background: ${
            color || '#535353'
          }; color: white; padding: 3px; font-size: 9px;`,
          ...things.slice(1)
        )
      : console.log(...things);
  }

  static clr() {
    console.clear();
  }

  static me(things: any[], tag?: string) {
    this.do('log', things, tag, '#535353');
  }
  static inf(things: any[], tag?: string) {
    this.do('info', things, tag, '#4b95ec');
  }
  static scs(things: any[], tag?: string) {
    this.do('log', things, tag, '#0d853d');
  }
  static wrn(things: any[], tag?: string) {
    this.do('warn', things, tag, '#ff8100');
  }
  static atn(things: any[], tag?: string) {
    this.do('log', things, tag, '#ff8100');
  }
  static err(things: any[], tag?: string) {
    this.do('error', things, tag, '#cc2748');
  }

  static logger(tag: string) {
    return new log(tag);
  }

  message(...things: any[]) {
    log.me(things, this._tag);
  }
  info(...things: any[]) {
    log.inf(things, this._tag);
  }
  success(...things: any[]) {
    log.scs(things, this._tag);
  }
  warning(...things: any[]) {
    log.wrn(things, this._tag);
  }
  attention(...things: any[]) {
    log.atn(things, this._tag);
  }
  error(...things: any[]) {
    log.err(things, this._tag);
  }
  clear() {
    log.clr();
  }
}
