import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons } from '../../icons/icons.enum';
import { InfoStripIconType } from './info-strip.enum';

export const INFOSTRIP_ICON_DICT: Record<InfoStripIconType, Icon> = {
  warning: {
    color: IconColor.primary_alt,
    icon: Icons.error_alt,
  },
  error: {
    color: IconColor.negative,
    icon: Icons.warning,
  },
  success: {
    color: IconColor.positive,
    icon: Icons.success,
  },
  information: {
    color: IconColor.inform,
    icon: Icons.baseline_info_icon,
  },
};
