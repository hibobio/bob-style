import { Chip } from '../../chips/chips.interface';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons } from '../../icons/icons.enum';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { AvatarBadge, AvatarOrientation, AvatarSize } from './avatar.enum';

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
  onClick?: (event: MouseEvent) => void;
  [key: string]: any;
}

export type AvatarInputCmnt = 'use [avatar] input for static props and separate inputs for dynamic props';
