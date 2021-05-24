import { ButtonType } from '../../buttons/buttons.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { ButtonConfig } from '../buttons.interface';

export const menuItemsMock: MenuItem[] = [
  {
    label: 'menu item 1',
    action: (item) => console.log(item.label),
  },
  {
    label: 'menu item 2',
    action: (item) => console.log(item.label),
  },
];

export const buttonConfigMock: ButtonConfig = {
  type: ButtonType.tertiary,
  color: IconColor.normal,
  icon: Icons.three_dots_vert,
};
