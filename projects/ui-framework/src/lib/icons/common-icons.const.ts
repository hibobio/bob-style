import { Icon } from '../icons/icon.interface';
import { IconColor, Icons, IconSize } from './icons.enum';

export const ICON_CONFIG: Record<'info' | 'reset' | 'refresh', Icon> = {
  info: {
    icon: Icons.info_outline,
    color: IconColor.normal,
    size: IconSize.small,
    hasHoverState: true,
  },
  reset: {
    icon: Icons.reset_x,
    size: IconSize.small,
    color: IconColor.normal,
    hasHoverState: true,
  },
  refresh: {
    icon: Icons.refresh,
    color: IconColor.normal,
    size: IconSize.large,
    hasHoverState: true,
  },
};
