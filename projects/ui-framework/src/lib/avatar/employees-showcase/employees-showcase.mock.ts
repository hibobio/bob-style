import { EmployeeShowcase } from './employees-showcase.interface';
import {
  simpleUID,
  makeArray,
  randomFromArray,
  dedupeArray,
} from '../../services/utils/functional-utils';
import { mockName } from '../../mock.const';
import { SelectGroupOption } from '../../lists/list.interface';
import { AvatarImageComponent } from '../avatar/avatar-image/avatar-image.component';
import { AvatarSize } from '../avatar/avatar.enum';

const maxEEs = 50;
const groupID = simpleUID();
const badges = ['approved', 'pending', 'rejected'];

const avatars = randomFromArray(
  dedupeArray(
    makeArray(200).map((_, i) =>
      i < 100
        ? `https://randomuser.me/api/portraits/men/${i}.jpg`
        : `https://randomuser.me/api/portraits/women/${i - 100}.jpg`
    )
  ),
  null
);

export const EMPLOYEE_SHOWCASE_MOCK: EmployeeShowcase[] = makeArray(maxEEs).map(
  (_, i) => ({
    id: simpleUID(),
    displayName: mockName(),
    imageSource: avatars[i],
  })
);

export const EMPLOYEE_SHOWCASE_OPTIONS_MOCK: SelectGroupOption[] = [
  {
    groupName: groupID,
    key: groupID,
    options: makeArray(maxEEs).map((_, i) => ({
      id: groupID + '_' + i,
      value: mockName(),
      selected: false,
      disabled: false,
      prefixComponent: {
        component: AvatarImageComponent,
        attributes: {
          imageSource: avatars[i],
          size: AvatarSize.mini,
          badge: randomFromArray(badges),
          // icon: randomIcon(),
        },
      },
    })),
  },
];
