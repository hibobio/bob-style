import { Icons } from '../../icons/icons.enum';

export interface MenuItem<T = any> {
  label: string;
  key?: string;
  id?: string;
  disabled?: boolean | ((item?: MenuItem) => boolean);
  data?: T;
  clickToOpenSub?: boolean;
  openLeft?: boolean;
  panelClass?: string;
  children?: MenuItem[];
  separatorAfter?: boolean;
  action?($event): void;
}

export interface CommonActionButton {
  icon: Icons;
  tooltip?: string;
  action?($event): void;
}
