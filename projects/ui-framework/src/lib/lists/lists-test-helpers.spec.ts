import {
  arrayFlatten,
  isArray,
  isBoolean,
  objectRemoveKey,
  objectRemoveKeys,
} from '../services/utils/functional-utils';
import { ListChange } from './list-change/list-change';
import { ListModelService } from './list-service/list-model.service';
import { itemID, SelectGroupOption } from './list.interface';

export const getOptionsModel = (
  options: SelectGroupOption[],
  selected: itemID[] | boolean = []
): SelectGroupOption[] =>
  options.map((g, i) => {
    g = { ...g };
    g.groupIndex = i;
    g.key = ListModelService.prototype.getGroupKey(g);
    g.optionsCount = g.options.length;
    g.options = g.options.map((o) => ({
      ...o,
      selected: isBoolean(selected)
        ? selected
        : isArray(selected)
        ? selected.includes(o.id)
        : o.selected,
    }));
    return g;
  });

export const mockListChange = (
  options: SelectGroupOption[],
  selected: itemID[] | boolean = []
): ListChange => {
  return new ListChange(
    getOptionsModel(options, selected),
    selected === false ? [] : isArray(selected) ? selected : undefined
  );
};

export const compareGOptions = (
  present: SelectGroupOption[],
  expected: SelectGroupOption[]
) => {
  const presentGroups = present.map((g) => objectRemoveKey(g, 'options'));
  const presentOptions = arrayFlatten(present.map((g) => g.options));
  const expectedGroups = expected.map((g) =>
    jasmine.objectContaining(
      objectRemoveKeys(g, ['options', 'key', 'optionsCount'])
    )
  );
  const expectedOptions = arrayFlatten(
    expected.map((g) => g.options)
  ).map((o) => jasmine.objectContaining(o));

  expect(presentGroups).toEqual(expectedGroups);
  expect(presentOptions).toEqual(expectedOptions);
};

export const compareListChange = (
  present: ListChange,
  expected: ListChange
) => {
  compareGOptions(present.selectGroupOptions, expected.selectGroupOptions);
};
