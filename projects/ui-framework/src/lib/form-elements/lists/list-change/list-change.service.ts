import { Injectable } from '@angular/core';
import { ListChange } from './list-change';
import { SelectGroupOption } from '../list.interface';
import { assign, chain, includes, map } from 'lodash';

@Injectable()
export class ListChangeService {

  getListChange(
    options: SelectGroupOption[],
    selectedIdsMap: (string | number)[],
  ): ListChange {
    const currentOptions = this.getCurrentSelectGroupOptions(options, selectedIdsMap);
    return new ListChange(currentOptions);
  }

  private getCurrentSelectGroupOptions(
    options: SelectGroupOption[],
    selectedIdsMap: (string | number)[],
  ): SelectGroupOption[] {
    return map(options, g => assign({}, g, {
      options: map(g.options, o => assign({}, o, {
        selected: includes(selectedIdsMap, o.id),
      })),
    }));
  }
}
