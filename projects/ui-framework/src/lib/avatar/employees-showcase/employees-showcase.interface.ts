import { Icon } from '../../icons/icon.interface';
import { Icons } from '../../icons/icons.enum';
import { SelectOption } from '../../lists/list.interface';
import { Avatar } from '../avatar/avatar.interface';

export interface EmployeeShowcase {
  id: string;
  displayName: string;
  imageSource?: string;
  icon?: Icons | Icon;
}

export type ShowcaseInputItem = EmployeeShowcase | SelectOption | Avatar;
