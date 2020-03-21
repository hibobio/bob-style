import { Icons } from '../../icons/icons.enum';
import { boolean } from '@storybook/addon-knobs';

export interface MenuItem<T = any> {
  label: string;
  key?: string;
  id?: string;
  disabled?: boolean | ((item?: MenuItem) => boolean);
  data?: T;
  clickToOpenSub?: boolean;
  openLeft?: boolean;
  panelClass?: string;
  action?: (item?: MenuItem) => void;
  children?: MenuItem[];
}

export interface CommonActionButton {
  icon: Icons;
  tooltip?: string;
  action?: (item?: MenuItem) => void;
}
