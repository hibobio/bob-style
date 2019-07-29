import { chain, concat, map, assign, filter } from 'lodash';
import { SelectGroupOption } from '../list.interface';

export class ListChange {
  private readonly selectGroupOptions: SelectGroupOption[];

  constructor(
    selectedGroupOptionsSrc: SelectGroupOption[],
  ) {
    this.selectGroupOptions = selectedGroupOptionsSrc;
  }

  getSelectGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions;
  }

  getSelectedIds(): (number | string)[] {
    return chain(this.selectGroupOptions)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .value();
  }

  getSelectedGroupOptions(): SelectGroupOption[] {
    return chain(this.selectGroupOptions)
      .map((groupOptions: SelectGroupOption) => assign({},
        groupOptions,
        { options: filter(groupOptions.options, option => option.selected) }))
      .filter(groupOption => groupOption.options.length)
      .value();
  }
}
