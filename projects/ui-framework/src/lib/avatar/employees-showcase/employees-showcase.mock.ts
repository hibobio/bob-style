import { EmployeeShowcase } from './employees-showcase.interface';
import {
  simpleUID,
  makeArray,
  randomFromArray,
} from '../../services/utils/functional-utils';
import { mockNames, mockAvatar, randomIcon } from '../../mock.const';
import { SelectGroupOption } from '../../lists/list.interface';
import { AvatarImageComponent } from '../avatar/avatar-image/avatar-image.component';
import { AvatarSize, AvatarBadge } from '../avatar/avatar.enum';

const maxEEs = 50;
const groupID = simpleUID();
const badges = Object.values(AvatarBadge);

export const EMPLOYEE_SHOWCASE_MOCK: EmployeeShowcase[] = makeArray(maxEEs).map(
  i => ({
    id: simpleUID(),
    displayName: mockNames(1),
    imageSource: mockAvatar(),
  })
);

export const EMPLOYEE_SHOWCASE_OPTIONS_MOCK: SelectGroupOption[] = [
  {
    groupName: groupID,
    key: groupID,
    options: makeArray(maxEEs).map((o, i) => ({
      id: groupID + '_' + i,
      value: mockNames(1),
      selected: false,
      disabled: false,
      prefixComponent: {
        component: AvatarImageComponent,
        attributes: {
          imageSource: mockAvatar(),
          size: AvatarSize.mini,
          badge: randomFromArray(badges),
          // icon: randomIcon(),
        },
      },
    })),
  },
];
