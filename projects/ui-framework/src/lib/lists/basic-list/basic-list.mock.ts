import { BasicListItem } from './basic-list.interface';
import {
  mockCities,
  mockCountries,
  mockHobbies,
  mockText,
} from '../../mock.const';
import { action } from '@storybook/addon-actions';
import {
  randomNumber,
  makeArray,
  randomFromArray,
} from '../../services/utils/functional-utils';
import { Icons } from '../../icons/icons.enum';

const icons = () =>
  randomFromArray([
    Icons.calendar,
    Icons.chat,
    Icons.doc_add,
    Icons.doc_icon,
    Icons.email,
    Icons.home,
    Icons.lock,
    Icons.note,
    Icons.department_icon,
    Icons.person,
    Icons.person_check,
    Icons.success,
    Icons.tag,
  ]);

const icon1 = icons();
const icon2 = icons();
const numberOfItems = 5;

const hobbies = mockHobbies();
const cities = mockCities();
const countries = mockCountries();

export const basicListItems1: BasicListItem[] = makeArray(numberOfItems).map(
  (_, index) => ({
    label: hobbies[index],
    icon: icon1,
    disabled: randomNumber() > 70,
    menu: [
      {
        label: mockText(randomNumber(1, 2)),
        action: action(`List item ${index + 1},  Menu action 1`),
      },
      {
        label: mockText(randomNumber(1, 2)),
        action: action(`List item ${index + 1},  Menu action 2`),
      },
    ],
  })
);

export const basicListItems2: BasicListItem[] = makeArray(numberOfItems).map(
  (_, index) => ({
    label: [cities[index], countries[index]],
    icon: icon2,
    menu: [
      {
        label: mockText(randomNumber(1, 2)),
        action: action(`List item ${index + 1},  Menu action 1`),
      },
      {
        label: mockText(randomNumber(1, 2)),
        action: action(`List item ${index + 1},  Menu action 2`),
      },
    ],
  })
);
