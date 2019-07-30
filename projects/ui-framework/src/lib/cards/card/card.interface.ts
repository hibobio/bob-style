import { MenuItem } from '../../navigation/menu/menu.interface';
import { Icons } from '../../icons/icons.enum';

export interface Card {
  title: string;
  titleEditable?: boolean;
  actionConfig?: CardActionButton;
  menuConfig?: MenuItem[];
  id?: string | number;
  footerCtaLabel?: string;
  imageUrl?: string;
}

export interface CardActionButton {
  icon: Icons;
  tooltip?: string;
  action?($event): void;
}
