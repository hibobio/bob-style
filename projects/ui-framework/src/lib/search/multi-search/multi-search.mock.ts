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
  mockJobs,
  uselessDomain,
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
iconsAnimals.push(...iconsAnimals, ...iconsAnimals);

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
iconsThings.push(...iconsThings);

const hobbies = mockHobbies().filter((h) => h.split(' ').length < 3);

const items = 30;

export const mockSearchData: MultiSearchGroupOption[] = [
  {
    groupName: 'People',
    key: 'people',
    icon: Icons.department_icon,
    options: ['Crème Brûlée', ...mockNames(items)].map(
      (name: string, index) => ({
        value: name,
        id: name,

        searchValue: [
          name,
          `${name.split(' ')[1]}, ${name.split(' ')[0]}`,
          `${mockNames(1)
            .toLowerCase()
            .replace(/\s/g, '.')}@${uselessDomain()}`,
          randomNumber(100000000, 999999999),
        ] as string[],

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
      })
    ),
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
      searchValue: mockAnimals(1),
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
    name: 'Hobbies',
    id: 'hobbies',
    icon: Icons.add_photo_camera_icon,
    children: makeArray(items).map((_, index: number) => ({
      id: hobbies[index],
      name: hobbies[index],
      label: `${mockText(randomNumber(1, 3))} > ${mockText(
        randomNumber(1, 3)
      )}`,
      searchValue: [hobbies[index], mockJobs(1), mockText(1)],
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
    icon: Icons.notification,
    children: mockBadJobs(items).map((job: string) => ({
      id: job,
      name: job,
      label: mockDepartments(1),
      searchValue: [job, mockHobbies(1), mockText(2)],
    })),
    optionClickHandler: (option: MultiSearchOption) => {
      console.log(`Handler for: ${option.name}`);
    },
  },
];

// ❯
