import { MultiSearchGroupOption } from './multi-search.interface';
import { mockAnimals, mockHobbies } from '../../mock.const';
import { optionsMock } from '../../lists/single-list/single-list.mock';
import { HListMockSingleGroup } from '../../lists/tree-list/tree-list.mock';

export const mockSearchData: MultiSearchGroupOption[] = [
  {
    groupName: 'Animals',
    key: 'animals',
    options: mockAnimals(10).map((animal: string) => ({
      id: animal,
      value: animal,
    })),
  },
  {
    keyMap: {
      key: 'id',
      groupName: 'name',
      options: 'children',
      value: 'name',
    },
    name: 'Hobbies',
    children: mockHobbies(10).map((hobby: string) => ({
      id: hobby,
      name: hobby,
    })),
  },
  {
    groupName: 'People',
    key: 'people',
    options: [...optionsMock[0].options, ...optionsMock[1].options],
  },
  {
    keyMap: {
      key: 'id',
      groupName: 'name',
      options: 'children',
      value: 'name',
    },
    ...HListMockSingleGroup[0],
  },
];
