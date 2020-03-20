import { Icons } from '../../icons/icons.enum';

export interface MenuItem<T = any> {
  children?: MenuItem[];
  label: string;
  disabled?: boolean | ((item?: MenuItem) => boolean);
  key?: string;
  id?: string;
  data?: T;
  action?: (item?: MenuItem) => void;
}

export interface CommonActionButton {
  icon: Icons;
  tooltip?: string;
  action?: (item?: MenuItem) => void;
}
