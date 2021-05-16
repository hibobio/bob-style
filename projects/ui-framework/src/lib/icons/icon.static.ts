import { PxSize } from '../types';
import { COLOR_TO_ICONCOLOR_MAP, SIZE_TO_ICONSIZE_MAP } from './icon.const';
import { Icon } from './icon.interface';
import { IconColor, IconSize } from './icons.enum';

export const getIconColor = (
  color: Icon['color']
): { color: Icon['color']; cssVar: string | null } => {
  const result: { color: Icon['color']; cssVar: string | null } = {
    color: null,
    cssVar: null,
  };

  if (!color) {
    return result;
  }

  result.color = COLOR_TO_ICONCOLOR_MAP[color] || color;

  if (result.color === IconColor.custom) {
    return result;
  }

  !Object.values(IconColor).includes(result.color as any) &&
    (result.color = IconColor.custom);

  result.color === IconColor.custom && (result.cssVar = color);

  return result;
};

export const getIconSize = (
  size: Icon['size']
): { size: Icon['size']; cssVar: PxSize | null } => {
  const result: { size: Icon['size']; cssVar: PxSize | null } = {
    size: null,
    cssVar: null,
  };

  if (!size) {
    return result;
  }

  const sizeNum = parseInt(size as any, 10) || '';

  result.size = SIZE_TO_ICONSIZE_MAP[sizeNum + ''] || size;

  if (result.size === IconSize.custom) {
    return result;
  }

  !Object.values(IconSize).includes(result.size as any) &&
    (result.size = IconSize.custom);

  sizeNum &&
    result.size === IconSize.custom &&
    (result.cssVar = (sizeNum + 'px') as PxSize);

  return result;
};
