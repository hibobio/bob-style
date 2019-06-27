import { Chip } from '../chip/chip.interface';
import { AvatarBadge, AvatarOrientation } from './avatar.enum';

export interface BadgeConfig {
  icon: string;
  color: string;
}

export interface Avatar {
  imageSource: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  chip?: Chip;
  badge?: AvatarBadge | BadgeConfig;
  orientation?: AvatarOrientation;
}
