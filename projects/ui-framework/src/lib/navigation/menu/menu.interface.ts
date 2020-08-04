import { Icons } from '../../icons/icons.enum';

export interface MenuItem<T = any> {
  label: string;
  key?: string; // menu item ID
  id?: string; // menu (or connected data T) ID
  disabled?: boolean | ((item?: MenuItem) => boolean);
  data?: T;
  clickToOpenSub?: boolean;
  openLeft?: boolean;
  panelClass?: string;
  children?: MenuItem[];
  separatorAfter?: boolean;
  isTitle?: boolean;
  action?($event): void;
}

export interface CommonActionButton {
  icon: Icons;
  tooltip?: string;
  action?($event): void;
}
