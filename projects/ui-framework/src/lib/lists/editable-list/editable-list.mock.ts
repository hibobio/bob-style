import { mockAnimals, mockText } from '../../mock.const';
import {
  makeArray,
  randomFromArray,
  randomNumber,
  simpleUID,
} from '../../services/utils/functional-utils';

const listItems = 59;

// export const editableListMock: SelectOption[] = mockHobbies()
//   .filter((v) => v.split(' ').length > 1)
//   .slice(0, listItems)
//   .map((v, index) => ({
//     id: simpleUID(),
//     value: v,
//     selected: randomNumber() > 90,
//     canBeDeleted: index !== listItems - 1,
//   }));

const prefixes = mockAnimals(15)
  .filter((a) => a.split(' ').length === 1)
  .slice(0, 10)
  .map((a) => a.toUpperCase());

export const editableListMock = makeArray(listItems).map((_, index) => ({
  id: simpleUID(),
  value:
    randomFromArray(prefixes, 1) +
    ': ' +
    mockText(randomNumber(2, 4)) +
    ` (${index})`,
  selected: randomNumber() > 90,
  canBeDeleted: true,
}));
