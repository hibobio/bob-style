import { Icons, IconColor } from '../../icons/icons.enum';
import {
  makeArray,
  randomFromArray,
  simpleUID,
} from '../../services/utils/functional-utils';
import { mockText, mockAvatar, mockNames, mockJobs } from '../../mock.const';
import { SideMenuOption } from './side-menu.interface';
import { AvatarBadge } from '../../avatar/avatar/avatar.enum';
import { MenuItem } from '../menu/menu.interface';

const menuMock: MenuItem[] = makeArray(4).map(() => ({
  label: mockText(1),
  action: () => {},
}));
menuMock[0].children = makeArray(2).map(() => ({
  label: mockText(1),
  action: () => {},
}));

export const sideMenuMock1: SideMenuOption[] = makeArray(4).map((i, index) => ({
  id: index,
  displayName: mockText(1),
  icon: Icons.folder,
  actions: menuMock,
}));

sideMenuMock1[3].disabled = true;

export const sideMenuMock2: SideMenuOption[] = makeArray(3)
  .map((i, index) => ({
    id: index,
    avatar: {
      imageSource: mockAvatar(),
      title: mockNames(1),
      subtitle: mockJobs(1),
      badge: randomFromArray(Object.keys(AvatarBadge)) as AvatarBadge,
    },
    actions: menuMock,
  }))
  .concat(
    makeArray(2).map((item, index) => ({
      id: index + 3,
      avatar: {
        icon: {
          icon: Icons.person_reports,
          color: IconColor.dark,
        },
        title: 'Reports ' + (index + 1),
      } as any,
      actions: menuMock,
    }))
  );

sideMenuMock2[3].avatar.badge = AvatarBadge.approved;
sideMenuMock2[4].disabled = true;
