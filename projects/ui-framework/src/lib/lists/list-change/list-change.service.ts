import { Injectable } from '@angular/core';
import { ListChange } from './list-change';
import { SelectGroupOption, SelectOption } from '../list.interface';
import { asArray } from '../../services/utils/functional-utils';

@Injectable()
export class ListChangeService {
  getListChange(
    options: SelectGroupOption[],
    selectedIDs: (string | number)[]
  ): ListChange {
    const currentOptions = this.getCurrentSelectGroupOptions(
      options,
      selectedIDs
    );
    return new ListChange(currentOptions, null);
  }

  getCurrentSelectGroupOptions(
    options: SelectGroupOption[],
    selectedIDs: (string | number)[]
  ): SelectGroupOption[] {
    return options.map((group: SelectGroupOption) => ({
      ...group,
      options: group.options.map((option: SelectOption) => ({
        ...option,
        selected: asArray(selectedIDs).includes(option.id),
      })),
    }));
  }
}
