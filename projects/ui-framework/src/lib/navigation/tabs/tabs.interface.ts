import { AvatarBadge } from '../../avatar/avatar/avatar.enum';
import { BadgeConfig } from '../../avatar/avatar/avatar.interface';

export interface Tab {
  label: string;
  key?: string;
  badge?: AvatarBadge | BadgeConfig;
}

export interface TabChangeEvent {
  index: number;
  tab: Tab;
}
