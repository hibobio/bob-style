import { mockHobbies } from '../../mock.const';
import { randomNumber, simpleUID } from '../../services/utils/functional-utils';
import { SelectOption } from '../list.interface';

const listItems = 10;

export const editableListMock: SelectOption[] = mockHobbies()
  .filter((v) => v.split(' ').length > 1)
  .slice(0, listItems)
  .map((v, index) => ({
    id: simpleUID(),
    value: v,
    selected: randomNumber() > 90,
    canBeDeleted: index !== listItems - 1,
  }));
