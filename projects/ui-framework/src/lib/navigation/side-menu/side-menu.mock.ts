import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import { Icons } from '../../icons/icons.enum';
import { makeArray } from '../../services/utils/functional-utils';
import { mockText } from '../../mock.const';

export const sideMenuOptionsMock: SideMenuOption[] = makeArray(5).map(
  (item, index) => ({
    id: index,
    displayName: mockText(1),
    icon: Icons.folder,
    actions: [
      {
        label: mockText(1),
        action: $event => {
          console.log($event);
        },
      },
    ],
  })
) as SideMenuOption[];
