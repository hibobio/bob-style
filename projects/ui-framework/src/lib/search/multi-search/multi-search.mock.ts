import { MultiSearchGroupOption } from './multi-search.interface';
import { mockAnimals, mockHobbies, mockThings } from '../../mock.const';
import { optionsMock } from '../../lists/single-list/single-list.mock';
import { HListMockSingleGroup } from '../../lists/tree-list/tree-list.mock';

export const mockSearchData: MultiSearchGroupOption[] = [
  {
    groupName: 'People',
    key: 'people',
    options: [
      ...optionsMock[0].options,
      ...optionsMock[1].options,
      ...optionsMock[3].options,
    ],
    clickHandler: (option: MultiSearchGroupOption) => {
      console.log(`Handler for: ${option.value}`);
    },
  },
  {
    groupName: 'Animals',
    key: 'animals',
    options: mockAnimals(15).map((animal: string) => ({
      id: animal,
      value: animal,
    })),
    clickHandler: (option: MultiSearchGroupOption) => {
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
    children: mockThings(15).map((thing: string) => ({
      serverId: thing,
      name: thing,
    })),
    clickHandler: (option: MultiSearchGroupOption) => {
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
    children: mockHobbies(15).map((hobby: string) => ({
      id: hobby,
      name: hobby,
    })),
    clickHandler: (option: MultiSearchGroupOption) => {
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
    ...HListMockSingleGroup[0],
    clickHandler: (option: MultiSearchGroupOption) => {
      console.log(`Handler for: ${option.name}`);
    },
  },
];
