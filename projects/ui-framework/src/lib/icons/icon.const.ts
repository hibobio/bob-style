import {
  ColorsGrey,
  ColorsMain,
} from '../services/color-service/color-palette.enum';
import { IconColor, IconColors, IconSize, IconSizes } from './icons.enum';

export const COLOR_TO_ICONCOLOR_MAP: Partial<
  Record<
    | ColorsGrey
    | ColorsMain
    | IconColors
    | 'primary_alt'
    | 'primary-alt'
    | '#fff'
    | '#ffffff',
    IconColor
  >
> = {
  '#fff': IconColor.white,
  '#ffffff': IconColor.white,

  [ColorsGrey.grey_500]: IconColor.light,
  [ColorsGrey.grey_600]: IconColor.normal,

  [ColorsGrey.grey_700]: IconColor.dark,
  [ColorsGrey.grey_800]: IconColor.dark,

  [ColorsMain.primary_500]: IconColor.primary,

  [ColorsMain.primary_600]: IconColor.warn,
  [ColorsMain.primary_700]: IconColor.warn,
  primary_alt: IconColor.warn,
  'primary-alt': IconColor.warn,

  [ColorsMain.inform_500]: IconColor.inform,
  [ColorsMain.inform_600]: IconColor.inform,

  [ColorsMain.negative_500]: IconColor.negative,
  [ColorsMain.negative_600]: IconColor.negative,
  [ColorsMain.negative_700]: IconColor.negative,

  [ColorsMain.positive_500]: IconColor.positive,
  [ColorsMain.positive_600]: IconColor.positive,
};

export const SIZE_TO_ICONSIZE_MAP: Partial<
  Record<IconSizes | '16' | '20' | '24' | '46' | '60', IconSize>
> = {
  '16': IconSize.small,
  '20': IconSize.medium,
  '24': IconSize.large,
  '46': IconSize.xLarge,
  '60': IconSize.xxLarge,

  xLarge: IconSize.xLarge,
  xxLarge: IconSize.xxLarge,
};
