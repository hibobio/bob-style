import { IconSize, Icons, IconColor } from '../../icons/icons.enum';
import { AvatarSize, AvatarBadge } from './avatar.enum';
import { BadgeConfig } from './avatar.interface';

export const BadgeSize: { [key in AvatarSize]: IconSize } = {
  [AvatarSize.mini]: IconSize.small,
  [AvatarSize.small]: IconSize.medium,
  [AvatarSize.medium]: IconSize.large,
  [AvatarSize.large]: IconSize.large,
  [AvatarSize.xlarge]: IconSize.xLarge,
};

export const AvatarIconSize: { [key in AvatarSize]: IconSize } = {
  [AvatarSize.mini]: IconSize.medium,
  [AvatarSize.small]: IconSize.large,
  [AvatarSize.medium]: IconSize.xLarge,
  [AvatarSize.large]: IconSize.xLarge,
  [AvatarSize.xlarge]: IconSize.xxLarge,
};

export const AvatarBadges: { [key in AvatarBadge]: BadgeConfig } = {
  [AvatarBadge.approved]: {
    icon: Icons.success,
    color: IconColor.positive,
  },
  [AvatarBadge.pending]: {
    icon: Icons.timeline,
    color: IconColor.normal,
  },
  [AvatarBadge.rejected]: {
    icon: Icons.error,
    color: IconColor.negative,
  },
  [AvatarBadge.online]: {
    icon: Icons.online,
    color: IconColor.positive,
  },
  [AvatarBadge.offline]: {
    icon: Icons.online,
    color: IconColor.light,
  },
};
