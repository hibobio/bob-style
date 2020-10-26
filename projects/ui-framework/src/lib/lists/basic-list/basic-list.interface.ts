import { Icons } from '../../icons/icons.enum';

export interface BasicListItem {
  label: string | string[];
  icon?: Icons;

  [key: string]: any;
}

export interface BasicListConfig {
  showActionOnHover?: boolean;
  maxLines?: number;
}
