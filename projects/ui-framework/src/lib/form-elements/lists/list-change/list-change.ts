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
  /**
   * @deprecate use getSelectedGroupOptions(). will be deleted shortly.
   */
  getSelected(): { id: number | string; groupName: string }[] {
    return chain(this.selectGroupOptions)
      .reduce(
        (selected, group) =>
          concat(
            selected,
            map(group.options, option => ({ option,  groupName: group.groupName }))
          ),
        [],
      )
      .filter(groupOption => groupOption.option.selected)
      .map(groupOption => ({ id: groupOption.option.id, groupName: groupOption.groupName }))
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
