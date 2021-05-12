import { SelectGroupOption } from '../list.interface';
import { mockCities, mockCountries } from '../../mock.const';
import { makeArray, simpleUID } from '../../services/utils/functional-utils';

const groupNames = mockCountries(4);
const options = mockCities(12);

export const optionsMock: SelectGroupOption[] = [
  ...makeArray(4).map((group, index) => {
    const groupId = simpleUID(
      groupNames[index].replace(/\s+/g, '').slice(0, 8).toUpperCase() + '-',
      3
    );

    return {
      groupName: groupNames[index],
      key: groupId,
      options: makeArray(3).map((_, oi) => {
        const optVal = options[index * 3 + oi];
        const optId = simpleUID(
          groupId +
          '/' +
          optVal.replace(/\s+/g, '').slice(0, 8).toUpperCase() +
          '-',
          3
        );

        return {
          id: optId,
          value: optVal
        };
      }),
    };
  })
];
