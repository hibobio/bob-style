import { ButtonType } from '../../buttons/buttons.enum';
import { Icons, IconColor } from '../../icons/icons.enum';
import { ButtonConfig } from '../buttons.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';

export const menuItemsMock: MenuItem[] = [
  {
    label: 'menu item 1'
  },
  {
    label: 'menu item 2'
  }
];

export const buttonConfigMock: ButtonConfig =  {
  type: ButtonType.tertiary,
  color: IconColor.normal,
  icon: Icons.three_dots_vert,
};

