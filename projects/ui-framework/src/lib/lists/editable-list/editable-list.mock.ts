import { SelectOption } from '../list.interface';
import { simpleUID, randomNumber } from '../../services/utils/functional-utils';
import { mockHobbies } from '../../mock.const';

const listItems = 10;

export const editableListMock: SelectOption[] = mockHobbies()
  .filter(v => v.split(' ').length > 1)
  .slice(0, listItems)
  .map((v, index) => ({
    id: simpleUID(),
    value: v,
    selected: randomNumber() > 90,
    canBeDeleted: index !== 0
  }));
