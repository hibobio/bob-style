import { GetElementStylesConfig } from './dom-helpers.interface';

export interface EnforceFontSizeConfig {
  enforce?: number[];
  remove?: (string | number)[];
  match?: number[][];
}

export interface ProcessCSS {
  preserveCSS: GetElementStylesConfig;
  enforceFontSize?: EnforceFontSizeConfig;
}
