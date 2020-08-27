import { Chip } from '../../chips/chips.interface';
import { AvatarBadge, AvatarOrientation, AvatarSize } from './avatar.enum';
import { Icons, IconColor } from '../../icons/icons.enum';
import { Icon } from '../../icons/icon.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

export interface BadgeConfig {
  icon: string;
  color: IconColor;
  iconAttribute?: string;
}

export interface Avatar {
  size?: AvatarSize;
  imageSource?: string;
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  icon?: Icons | Icon;
  badge?: AvatarBadge | BadgeConfig;
  chip?: Chip;
  afterChipText?: string;
  orientation?: AvatarOrientation;
  disabled?: boolean;
  isClickable?: boolean;
  tooltipType?: TruncateTooltipType;
  expectChanges?: boolean;
  supressWarnings?: boolean;
  [key: string]: any;
}
