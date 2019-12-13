import { SelectOption } from '../list.interface';
import { simpleUID, randomNumber } from '../../services/utils/functional-utils';
import { mockHobbies } from '../../mock.const';

const listItems = 10;

export const editableListMock: SelectOption[] = mockHobbies()
  .filter(i => i.split(' ').length > 1)
  .slice(0, listItems)
  .map(i => ({
    id: simpleUID(),
    value: i,
    selected: randomNumber() > 90,
  }));
