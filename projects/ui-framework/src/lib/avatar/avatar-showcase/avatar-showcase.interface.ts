import { Icon } from '../../icons/icon.interface';
import { Icons } from '../../icons/icons.enum';
import { SelectOption } from '../../lists/list.interface';
import { Avatar } from '../avatar/avatar.interface';

export interface AvatarShowcase {
  id: string;
  displayName: string;
  imageSource?: string;
  icon?: Icons | Icon;
}

export interface EmployeeShowcase extends AvatarShowcase {}

export type ShowcaseInputItem = AvatarShowcase | SelectOption | Avatar;
