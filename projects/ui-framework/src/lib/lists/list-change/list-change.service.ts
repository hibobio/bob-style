import { Injectable } from '@angular/core';
import { ListChange } from './list-change';
import { itemID, SelectGroupOption, SelectOption } from '../list.interface';
import { asArray } from '../../services/utils/functional-utils';

@Injectable({
  providedIn: 'root',
})
export class ListChangeService {
  getListChange(
    options: SelectGroupOption[],
    selectedIDs: itemID[]
  ): ListChange {
    const currentOptions = this.getCurrentSelectGroupOptions({
      options,
      selectedIDs,
    });
    return new ListChange(currentOptions, null);
  }

  getCurrentSelectGroupOptions({
    options,
    selectedIDs,
  }: {
    options: SelectGroupOption[];
    selectedIDs: itemID[];
  }): SelectGroupOption[] {
    return options.map((group: SelectGroupOption) => ({
      ...group,
      options: group.options.map((option: SelectOption) => ({
        ...option,
        selected: asArray(selectedIDs).includes(option.id),
      })),
    }));
  }
}
