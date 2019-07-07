import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import {
  simpleUID,
  randomNumber,
  randomFromArray,
  arrayDifference
} from '../../services/utils/functional-utils';
import { mockHobbies } from '../../mock.const';

const maxOpts = 10;

const oldPeopleHobbies = randomFromArray(mockHobbies(), maxOpts);
const couplesHobbies = randomFromArray(
  arrayDifference(mockHobbies(), oldPeopleHobbies),
  maxOpts
);
const kidsHobbies = randomFromArray(
  arrayDifference(mockHobbies(), oldPeopleHobbies.concat(couplesHobbies)),
  maxOpts
);

const mayBeSelected = () => {
  return randomNumber() > 90;
};

export const MultiListAndChipsOptionsMock: SelectGroupOption[] = [
  {
    groupName: 'For kids',
    options: kidsHobbies.map(hobby => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected()
    }))
  },
  {
    groupName: 'For couples',
    options: couplesHobbies.map(hobby => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected()
    }))
  },
  {
    groupName: 'For old people',
    options: oldPeopleHobbies.map(hobby => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected()
    }))
  }
];
