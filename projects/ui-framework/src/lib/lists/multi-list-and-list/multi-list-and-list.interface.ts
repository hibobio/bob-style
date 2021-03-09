import { Icons } from '../../icons/icons.enum';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { BasicListItem } from '../basic-list/basic-list.interface';
import { itemID } from '../list.interface';

export interface ListViewConfig {
  rowStartIcon?: Icons;
  rowAction?: {
    icon: Icons;
    menu?: MenuItem[];
  };
  showActionOnHover?: boolean;
  maxLines?: number;
}

export interface ListRow extends BasicListItem {
  actionIcon?: Icons;
  menu?: MenuItem[];
  id: itemID;
  disabled?: boolean;
}
