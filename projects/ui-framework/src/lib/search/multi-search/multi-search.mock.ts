import {
  MultiSearchGroupOption,
  MultiSearchOption,
} from './multi-search.interface';
import {
  mockAnimals,
  mockHobbies,
  mockThings,
  mockDepartments,
  adorableAvatar,
  mockAvatar,
  mockNames,
  mockBadJobs,
  mockText,
} from '../../mock.const';
import { Icons } from '../../icons/icons.enum';
import {
  randomFromArray,
  makeArray,
  randomNumber,
} from '../../services/utils/functional-utils';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { AvatarBadge } from '../../avatar/avatar/avatar.enum';

const iconsAnimals = [
  Icons.twitter,
  Icons.notification,
  Icons.at,
  Icons.harmonise,
  Icons.infinite,
  Icons.location,
  Icons.send,
  Icons.share,
  Icons.tag,
  Icons.view_icon,
  Icons.twitter,
  Icons.notification,
  Icons.at,
  Icons.harmonise,
  Icons.infinite,
];

const iconsThings = [
  Icons.assignment,
  Icons.at,
  Icons.attachment,
  Icons.attendance_link,
  Icons.benefits_link,
  Icons.benefits_alt,
  Icons.cake,
  Icons.calendar,
  Icons.delete,
  Icons.doc_description,
  Icons.edit_field_pencil,
  Icons.email,
  Icons.folder,
  Icons.harmonise,
  Icons.home,
  Icons.infinite,
  Icons.location,
  Icons.lock,
  Icons.megaphone,
  Icons.notification,
  Icons.performance_link,
  Icons.phone_link,
  Icons.pin,
  Icons.print,
  Icons.save,
  Icons.send,
  Icons.settings,
  Icons.tag,
  Icons.timeline,
];

const hobbies = mockHobbies().filter((h) => h.split(' ').length < 3);

const items = 30;

export const mockSearchData: MultiSearchGroupOption[] = [
  {
    groupName: 'People',
    key: 'people',
    icon: Icons.department_icon,
    options: mockNames(items).map((name: string) => ({
      value: name,
      id: name,
      prefixComponent: {
        component: AvatarImageComponent,
        attributes: {
          imageSource: mockAvatar(),
          badge: randomFromArray([
            null,
            null,
            null,
            AvatarBadge.approved,
            AvatarBadge.pending,
            AvatarBadge.rejected,
            AvatarBadge.error,
          ]),
        },
      },
    })),
    optionClickHandler: (option: MultiSearchOption) => {
      console.log(`Handler for: ${option.value}`);
    },
  },
  {
    groupName: 'Animals',
    key: 'animals',
    icon: Icons.twitter,
    options: mockAnimals(items).map((animal: string, index: number) => ({
      id: animal,
      value: animal,
      prefixComponent: {
        component: AvatarImageComponent,
        attributes: {
          imageSource: adorableAvatar(),
          icon: iconsAnimals[index],
        },
      },
    })),
    optionClickHandler: (option: MultiSearchOption) => {
      console.log(`Handler for: ${option.value}`);
    },
  },
  {
    keyMap: {
      key: 'serverId',
      id: 'serverId',
      groupName: 'name',
      options: 'children',
      value: 'name',
    },
    name: 'Things',
    serverId: 'things',
    icon: Icons.attachment,
    children: mockThings(items).map((thing: string, index: number) => ({
      serverId: thing,
      name: thing,
      icon: iconsThings[index],
    })),
    optionClickHandler: (option: MultiSearchOption) => {
      console.log(`Handler for: ${option.value}`);
    },
  },
  {
    keyMap: {
      key: 'id',
      groupName: 'name',
      options: 'children',
      value: 'name',
    },
    name: 'Hobbies',
    id: 'hobbies',

    children: makeArray(items).map((_, index: number) => ({
      id: hobbies[index],
      name: hobbies[index],
      label: `${mockText(randomNumber(1, 3))} > ${mockText(
        randomNumber(1, 3)
      )}`,
    })),
    optionClickHandler: (option: MultiSearchOption) => {
      console.log(`Handler for: ${option.name}`);
    },
  },
  {
    keyMap: {
      key: 'id',
      groupName: 'name',
      options: 'children',
      value: 'name',
    },
    id: 'Jobs',
    name: 'Jobs',
    children: mockBadJobs(items).map((job: string) => ({
      id: job,
      name: job,
      label: mockDepartments(1),
    })),
    optionClickHandler: (option: MultiSearchOption) => {
      console.log(`Handler for: ${option.name}`);
    },
  },
];

// ❯
