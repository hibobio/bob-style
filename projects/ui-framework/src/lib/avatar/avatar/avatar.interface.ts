import { Chip } from '../../chips/chips.interface';
import { AvatarBadge, AvatarOrientation, AvatarSize } from './avatar.enum';
import { Icons, IconColor } from '../../icons/icons.enum';
import { Icon } from '../../icons/icon.interface';

export interface BadgeConfig {
  icon: string;
  color: IconColor;
  iconAttribute?: string;
}

export interface Avatar {
  imageSource?: string;
  backgroundColor?: string;
  size?: AvatarSize;
  title?: string;
  subtitle?: string;
  caption?: string;
  icon?: Icons | Icon;
  chip?: Chip;
  badge?: AvatarBadge | BadgeConfig;
  orientation?: AvatarOrientation;
  disabled?: boolean;
  isClickable?: boolean;
  supressWarnings?: boolean;
}
