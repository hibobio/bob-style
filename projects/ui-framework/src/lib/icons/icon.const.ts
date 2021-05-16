import {
  ColorsGrey,
  ColorsMain,
} from '../services/color-service/color-palette.enum';
import { IconColor, IconSize, IconSizes } from './icons.enum';

export const COLOR_TO_ICONCOLOR_MAP: Partial<
  Record<
    ColorsGrey | ColorsMain | IconSizes | keyof typeof IconColor,
    IconColor
  >
> = {
  [ColorsGrey.grey_500]: IconColor.light,
  [ColorsGrey.grey_600]: IconColor.normal,
  [ColorsGrey.grey_700]: IconColor.dark,

  [ColorsMain.primary_500]: IconColor.primary,
  [ColorsMain.primary_600]: IconColor.primary_alt,

  [ColorsMain.inform_500]: IconColor.inform,
  [ColorsMain.inform_600]: IconColor.inform,

  [ColorsMain.negative_500]: IconColor.negative,
  [ColorsMain.negative_600]: IconColor.negative,

  [ColorsMain.positive_500]: IconColor.positive,
  [ColorsMain.positive_600]: IconColor.positive,

  primary_alt: IconColor.primary_alt,
};

export const SIZE_TO_ICONSIZE_MAP: Record<string, IconSize> = {
  '16': IconSize.small,
  '20': IconSize.medium,
  '24': IconSize.large,
  '46': IconSize.xLarge,
  '60': IconSize.xxLarge,

  xLarge: IconSize.xLarge,
  xxLarge: IconSize.xxLarge,
};
