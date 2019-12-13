import { Icons } from '../../icons/icons.enum';

export interface MenuItem {
  children?: MenuItem[];
  label: string;
  disabled?: boolean;
  key?: string;
  id?: string;
  action?($event): void;
}

export interface CommonActionButton {
  icon: Icons;
  tooltip?: string;
  action?($event): void;
}
